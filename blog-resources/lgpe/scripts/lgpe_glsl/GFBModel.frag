#version 330

in vec3 objectPosition;
in vec3 localPosition;
in vec2 f_texcoord0;
in vec2 f_texcoord1;
in vec2 f_texcoord2;
in vec3 normal;
in vec3 rimViewDir;
in vec3 tangent;
in vec3 binormal;

uniform mat4 mtxCam;
uniform sampler2D DiffuseMap;
uniform sampler2D AmbientMap;
uniform sampler2D OverlayMap;
uniform sampler2D SphereMapMap;
uniform sampler2D ShadowMap;
// LightTblTex -- the real PokeDefaultShader's toon ramp lookup table (e.g. 'pm0126_00_lta',
// 512x8 RGBA8). Traced out of the decoded BodyA.bnsh_fsh: the game samples it at
// u = N.L*0.5+0.5, v = 0.96875 - 0.0625*LightTblIndex, and uses .r/.g as two of three
// partition-of-unity band weights (r+g+b == 1 at every texel).
uniform sampler2D LightTblMap;
// EmissionMaskTex. Two independent jobs in the real shader: .x drives the "emission lerp" that
// fades the whole lighting result out toward a flat self-lit colour, and .y is the mask texture
// the SpecularMaskEnable / SphereMaskEnable / RimMaskEnable switches modulate their own scale
// with. Almost every material binds 'dummy_col' here, so both are usually inert.
uniform sampler2D EmissionMaskMap;
// EffectTex. Sampled at the constant coordinate (0, 1) by the real shader, so it is effectively
// a per-model constant colour that scales the final result by (1 + EffectVal * sample).
uniform sampler2D EffectMap;
uniform sampler2D GengarMaskMap;
uniform sampler2D NormalMap;

uniform int HasDiffuse;
uniform int HasAmbientMap;
uniform int HasOverlayMap;
uniform int SwitchPriority;
uniform int HasSphereMap;
uniform int HasShadowMap;
uniform int HasLightTbl;
uniform int HasEmissionMask;
uniform int HasEffectMap;
uniform int HasNormalMap;
uniform int NormalMapEnable;
uniform int BaseColorAddEnable;
uniform int SphereMaskEnable;
uniform int EffectVal;
uniform float NormalMapUVScaleU;
uniform float NormalMapUVScaleV;
uniform float EmissionMaskVal;
uniform float ConstantColorVal;
uniform float ConstantAlpha;
uniform float OnGameEmissionVal;
uniform float OnGameColorVal;
uniform float OnGameAlpha;
uniform vec3 ConstantColor;
uniform vec3 OnGameColor;
// Layer1 (LyCol0Tex) tint pairs. The real shader keeps the base and shadow colour chains apart
// all the way through and composites the layer into EACH of them with its own colours -- the
// unshaded chain gets L1ConstantColor0/1 plus the additive L1AddColor0/1, the shaded chain gets
// L1ConstantColorSd0/1 -- then cross-fades each pair by ColorLerpValue, exactly like the base
// Col0Tex tints above.
uniform vec3 L1ConstantColor0;
uniform vec3 L1ConstantColor1;
uniform vec3 L1ConstantColorSd0;
uniform vec3 L1ConstantColorSd1;
uniform vec3 L1AddColor0;
uniform vec3 L1AddColor1;
uniform float L1ConstantColor0Val;
uniform float L1ConstantColor1Val;
uniform float L1ConstantColorSd0Val;
uniform float L1ConstantColorSd1Val;
uniform float L1AddColor0Val;
uniform float L1AddColor1Val;
uniform int LightTableEnable;
uniform float LightTblIndex;
uniform int AmbientMapEnable;
// Per-material colour and weight values multiply the base and shaded textures before the ramp blend.
uniform vec3 ConstantColor0;
uniform vec3 ConstantColor1;
uniform vec3 ConstantColorSd0;
uniform vec3 ConstantColorSd1;
uniform vec3 DeepShadowColor;
uniform vec3 RimColorShadow;
uniform float ConstantColor0Val;
uniform float ConstantColor1Val;
uniform float ConstantColorSd0Val;
uniform float ConstantColorSd1Val;
uniform float ColorLerpValue;
uniform float LightMul;
// cbuf_1[0].x in the decompile: a single global scalar, in a SCENE constant buffer rather than
// the material one, added to the lit band weight -- wLit = (wLit - 1)*t + LightAmbient. At 1.0 it
// is the identity and the three band weights stay a partition of unity; above 1.0 it lifts every
// texel toward the base colour, which is the only ambient/fill term anywhere in the shader. Its
// runtime value is scene data this renderer has no source for, so it defaults to the identity and
// is exposed via GFB_LIGHT_AMBIENT for tuning.
uniform float LightAmbient;
uniform float RimColorVal;
uniform float RimLimit;
uniform int SphereMapEnable;
uniform float SphereMapColorVal;
uniform vec3 SphereMapColor;
uniform vec3 viewDirObj;
uniform int SpecularMaskEnable;
uniform float SpecularPower;
uniform float SpecularScale;
uniform vec3 SpecularColor;
uniform int RimMaskEnable;
uniform float RimPower;
uniform float RimStrength;
uniform vec3 RimColor;
// Material.Common.Switches are parsed separately from the ordinary per-material values.
uniform int DiscardEnable;
uniform int TextureAlphaTestEnable;
uniform int AlphaBlendEnable;
uniform int HasValidUV1;
// Layer1UvIdx selects the UV channel used by the overlay texture.
uniform int Layer1UvIdx;
uniform float Layer1OverLerpValue;

uniform vec3 specLightDirection;
uniform vec3 difLightDirection;

uniform float ColorUVScaleU;
uniform float ColorUVScaleV;
uniform float ColorUVTranslateU;
uniform float ColorUVTranslateV;
uniform float ColorBaseU;
uniform float ColorBaseV;

uniform float Layer1UVScaleU;
uniform float Layer1UVScaleV;
uniform float Layer1UVTranslateU;
uniform float Layer1UVTranslateV;
uniform float Layer1BaseU;
uniform float Layer1BaseV;

uniform int RedChannel;
uniform int GreenChannel;
uniform int BlueChannel;
uniform int AlphaChannel;
uniform int IsFireHorn;
uniform float u_time;
uniform int DebugUV;
uniform int IsEyeMesh;
uniform int IsMegaGengar;
uniform int HasGengarMaskMap;
uniform float MaskUVScale;
uniform float MaskUVTransU;
uniform float MaskUVTransV;
uniform float bottomLine;
uniform float TopLine;
uniform float LerpPow;
uniform float MaskAddVal;
uniform float topLineScale;
uniform vec3 GroundEffectCol;

out vec4 fragColor;

float GetComponent(int Type, vec4 Texture);

// Fold the eye overlay's UV window explicitly; sampler wrap settings may not be mirrored.
float mirrorFold(float x)
{
    float t = fract(x * 0.5) * 2.0; // period-2 sawtooth in [0, 2)
    return 1.0 - abs(t - 1.0);      // folds into a period-2 triangle wave in [0, 1]
}

vec2 mirrorFold(vec2 v)
{
    return vec2(mirrorFold(v.x), mirrorFold(v.y));
}

// Composite the overlay separately into each colour chain so its tint follows the ramp.
vec3 applyLayer(vec3 chainCol, vec3 layerRgb, float layerA, float diffA)
{
    if (SwitchPriority == 1)
    {
        // Eye overlays provide the eyeball; diffuse alpha selects eyelid/skin over the eye opening.
        return mix(layerRgb, chainCol, diffA);
    }
    if (layerA > 0.01)
        return mix(chainCol, layerRgb, layerA);
    return chainCol;
}

void main()
{
    vec2 uvScale = vec2(ColorUVScaleU, ColorUVScaleV);
    if (length(uvScale) < 0.001) uvScale = vec2(1.0);

    vec2 uvTranslate = vec2(ColorUVTranslateU, ColorUVTranslateV);
    vec2 shift = vec2(ColorBaseU, ColorBaseV);
    // Diffuse UVs repeat across body textures; do not mirror-fold them.
    // The decoded transform subtracts the pivot before scaling: scale * (uv - pivot).
    vec2 effectiveUvScale = (IsEyeMesh == 1) ? vec2(1.0) : uvScale;
    vec2 diffuseUV = effectiveUvScale * (f_texcoord0.xy - shift - uvTranslate);
    // The vertex buffer stores 1 - rawV; apply the decoded vertical flip after scale and pivot so UV scroll keeps its direction.
    if (IsEyeMesh == 0)
        diffuseUV.y = 1.0 - effectiveUvScale.y * (1.0 - f_texcoord0.y - shift.y - uvTranslate.y);

    if (DebugUV == 1)
    {
        // R = fractional part of diffuseUV.x (position within one wrap cycle)
        // G = which wrap cycle (floor(diffuseUV.x) mod 4) -- shows how many times
        //     GL_MIRRORED_REPEAT is folding across this surface
        fragColor = vec4(fract(diffuseUV.x), mod(floor(diffuseUV.x), 4.0) / 4.0, 0.0, 1.0);
        return;
    }

    vec4 diffuseSample = texture(DiffuseMap, diffuseUV);
    // *_col textures are sampled in linear space; perform one sRGB encode on final output.
    // This keeps ramp and lighting operations in linear space.

    if (DebugUV == 8)
    {
        fragColor = vec4(diffuseSample.aaa, 1.0);
        return;
    }

    // Alpha cutout removes transparent texels; the 0.5 threshold is a working value.
    if (HasDiffuse == 1 && (DiscardEnable == 1 || TextureAlphaTestEnable == 1) && diffuseSample.a < 0.5)
        discard;

    vec3 albedo = (HasDiffuse == 1) ? diffuseSample.rgb : vec3(1.0);

    // Capture Layer1 here, then composite it separately into the lit and shadow colour chains.
    bool hasLayer = false;
    vec4 layerSample = vec4(0.0);

    // Layer1OverLerpValue = 0 disables the overlay when the base texture already contains the finished eye.
    if (HasOverlayMap == 1 && Layer1OverLerpValue > 0.001)
    {
        // Layer1UvIdx selects the overlay UV channel; the CPU-computed UV1 range is only a fallback.
        vec2 l1Scale = vec2(Layer1UVScaleU, Layer1UVScaleV);
        if (length(l1Scale) < 0.001) l1Scale = vec2(1.0);
        vec2 l1Trans = vec2(Layer1UVTranslateU, Layer1UVTranslateV);
        vec2 l1Shift = vec2(Layer1BaseU, Layer1BaseV);

        vec2 baseCoord =
            (Layer1UvIdx == 0) ? f_texcoord0.xy :
            (Layer1UvIdx == 1) ? f_texcoord1 :
            (Layer1UvIdx == 2) ? f_texcoord2 :
            ((HasValidUV1 == 1) ? f_texcoord1 : diffuseUV);
        // Overlay UVs use the same pivot-before-scale transform as diffuse UVs.
        vec2 overlayUV = mirrorFold(l1Scale * (baseCoord - l1Shift - l1Trans));

        vec4 overlay = texture(OverlayMap, overlayUV);
        if (DebugUV == 2)
        {
            fragColor = overlay;
            return;
        }
        if (DebugUV == 3)
        {
            fragColor = vec4(fract(overlayUV.x), fract(overlayUV.y), 0.0, 1.0);
            return;
        }
        // Left linear, same as diffuseSample above -- the sRGB encode happens once on output.
        hasLayer = true;
        layerSample = overlay;
    }

    // ---- SphereMap: cheap matcap-style environment/metallic reflection ----
    // SphereMap is an environment reflection added after the ramp, alongside specular.
    vec3 sphereAdd = vec3(0.0);
    if (HasSphereMap == 1 && SphereMapEnable == 1)
    {
        vec3 N2 = length(normal) > 0.001 ? normalize(normal) : vec3(0.0, 1.0, 0.0);
        vec3 V = normalize(viewDirObj);
        vec3 R = reflect(-V, N2);
        vec2 sphereUV = R.xy * 0.5 + 0.5;
        sphereAdd = texture(SphereMapMap, sphereUV).rgb * SphereMapColor * SphereMapColorVal;
    }

    if (DebugUV == 9)
    {
        // Raw Col0Tex only. The layer is no longer merged in here -- it is composited into
        // colBase/colShadow further down, after this point.
        fragColor = vec4(pow(albedo, vec3(1.0 / 2.2)), 1.0);
        return;
    }

    // Toon lighting follows the decoded PokeDefaultShader fragment stage.
    // Constant-buffer slots map to the GFBMDL's ordered Values and Colors arrays.
    // Shape of the real model, in the game's own order:
    //   colBase   = mix(col*ConstantColor0,  col*ConstantColor1,  ColorLerpValue)
    //   colShadow = mix(col->sdw*ConstantColorSd0, col->sdw*ConstantColorSd1, ColorLerpValue)
    //   n         = dot(N, L) + 2*(ambient.b - 0.5)
    //   (wDeep, wShadow) = LightTblTex(n*0.5+0.5, 0.96875 - 0.0625*LightTblIndex).rg
    //   wLit      = 1 - wDeep - wShadow          // the LUT is a partition of unity
    //   colour    = (colShadow*wShadow + colShadow*DeepShadowColor*wDeep + colBase*wLit)*LightMul
    // then additive specular and rim, with the rim capped by
    //   colour = min(colour + rim, colourBeforeRim * RimLimit).
    // =====================================================================================

    // ---- AmbientTex: NOT a plain AO multiply. The real shader reads three separate channels:
    //      .r forces the deep-shadow band, .g pushes lit surface into the shadow band (the
    //      actual occlusion channel) and .b biases N.L before the ramp lookup. All three are
    //      gated on the material's own AmbientMapEnable switch. ----
    float ambDeepMask = 0.0;   // -> m0 in the decoded shader
    float ambShadowMask = 0.0; // -> m1
    float ambNdotLBias = 0.0;
    if (HasAmbientMap == 1 && AmbientMapEnable == 1)
    {
        vec4 ambTex = texture(AmbientMap, diffuseUV);
        if (DebugUV == 11) { fragColor = vec4(ambTex.rgb, 1.0); return; }
        ambDeepMask = ambTex.r;
        ambShadowMask = ambTex.g;
        ambNdotLBias = 2.0 * (ambTex.b - 0.5);
    }

    // ---- EmissionMaskTex ----
    // .x drives the "emission lerp": the real shader scales the shadow and deep band weights by
    // it, pushes the lit weight toward 1, and lerps the final colour away from its constant-
    // colour tint -- i.e. at 0 the surface stops being lit at all and reads as flat self-lit
    // art. .y is the mask the three *MaskEnable switches attenuate their own scale with.
    float emissionLerp = 1.0;   // -> t in the decoded shader
    float maskTexValue = 0.0;
    if (HasEmissionMask == 1)
    {
        vec2 emission = texture(EmissionMaskMap, diffuseUV).xy;
        emissionLerp = 1.0 - emission.x * EmissionMaskVal;
        maskTexValue = 1.0 - emission.y;
    }

    // ---- Vectors ----
    vec3 N = length(normal) > 0.001 ? normalize(normal) : vec3(0.0, 1.0, 0.0);

    // NormalMapTex, blended in by NormalMapEnable exactly as the decoded shader does: sample at
    // (u * NormalMapUVScaleU, 1 - v * NormalMapUVScaleV), expand with fma(x, 2, -1), rotate into
    // object space through the interpolated tangent frame, then lerp from the vertex normal by
    // the switch. Every material checked in this romfs has NormalMapEnable=False with
    // 'dummy_col' bound, so this is currently inert -- it is here so it is correct when a model
    // that does use it turns up.
    if (HasNormalMap == 1 && NormalMapEnable == 1)
    {
        vec2 nrmUV = vec2(f_texcoord0.x * NormalMapUVScaleU,
                          1.0 - f_texcoord0.y * NormalMapUVScaleV);
        vec3 nrmTex = texture(NormalMap, nrmUV).rgb * 2.0 - 1.0;
        vec3 T = length(tangent) > 0.001 ? normalize(tangent) : vec3(1.0, 0.0, 0.0);
        vec3 B = length(binormal) > 0.001 ? normalize(binormal) : normalize(cross(N, T));
        vec3 mapped = normalize(nrmTex.x * T + nrmTex.y * B + nrmTex.z * N);
        N = normalize(mix(N, mapped, 1.0));
    }

    vec3 L = specLightDirection;
    if (dot(L, L) > 0.001)
        L = normalize(L);
    else
        L = normalize(vec3(-0.50, 0.70, -0.50));

    // ---- The two colour endpoints the ramp blends between ----
    vec3 colTex = albedo;
    vec3 sdwTex = colTex;
    if (HasShadowMap == 1)
    {
        // ColSdw0Tex: Game Freak's hand-painted shaded variant of the diffuse map. Linear,
        // like every other colour texture here.
        sdwTex = texture(ShadowMap, diffuseUV).rgb;
    }

    // Lit endpoint: the base colour tinted by the material's two constant colours, each with
    // its own strength, then cross-faded by ColorLerpValue (this is the pair of tint slots the
    // decoded shader applies to Col0Tex via cbuf_6[0]/cbuf_6[2] and cbuf_5[1].z/cbuf_5[2].y).
    vec3 colBase = mix(mix(colTex, colTex * ConstantColor0, ConstantColor0Val),
                       mix(colTex, colTex * ConstantColor1, ConstantColor1Val),
                       ColorLerpValue);

    // Shadow endpoint: same structure, but each variant lerps from the BASE colour toward the
    // shaded texture times its Sd tint -- so a material with ConstantColorSd*Val == 0 keeps its
    // plain diffuse in shadow rather than snapping to the sdw art.
    vec3 colShadow = mix(mix(colTex, sdwTex * ConstantColorSd0, ConstantColorSd0Val),
                         mix(colTex, sdwTex * ConstantColorSd1, ConstantColorSd1Val),
                         ColorLerpValue);

    // Layer1 composited into each chain separately, with that chain's own tint pair. The
    // unshaded chain also takes the additive L1AddColor pair; the shaded chain has no additive
    // slot in the real shader, matching the Sd naming.
    if (hasLayer)
    {
        vec3 layerRgb = layerSample.rgb;
        vec3 layerBase = mix(mix(layerRgb, layerRgb * L1ConstantColor0, L1ConstantColor0Val),
                             mix(layerRgb, layerRgb * L1ConstantColor1, L1ConstantColor1Val),
                             ColorLerpValue)
                       + mix(L1AddColor0 * L1AddColor0Val,
                             L1AddColor1 * L1AddColor1Val,
                             ColorLerpValue);
        vec3 layerShadow = mix(mix(layerRgb, layerRgb * L1ConstantColorSd0, L1ConstantColorSd0Val),
                               mix(layerRgb, layerRgb * L1ConstantColorSd1, L1ConstantColorSd1Val),
                               ColorLerpValue);

        colBase = applyLayer(colBase, layerBase, layerSample.a, diffuseSample.a);
        colShadow = applyLayer(colShadow, layerShadow, layerSample.a, diffuseSample.a);
    }

    // ---- Ramp ----
    float ndl = dot(N, L) + ambNdotLBias;

    float wDeep, wShadow, wLit;
    if (HasLightTbl == 1 && LightTableEnable == 1)
    {
        // v picks the LUT row: the decoded shader computes it as 0.96875 - 0.0625*LightTblIndex
        // (0.96875 == 31/32, the centre of the top row of a 16-row atlas; the 512x8 tables
        // shipped with these models make consecutive indices share a row, which is harmless).
        float lutV = 0.96875 - 0.0625 * LightTblIndex;
        vec2 lut = texture(LightTblMap, vec2(clamp(ndl * 0.5 + 0.5, 0.0, 1.0), lutV)).rg;
        wDeep = lut.r;
        wShadow = lut.g;
        wLit = 1.0 - lut.r - lut.g;
    }
    else
    {
        // The shader's own no-LUT fallback path: a plain clamped Lambert split, no deep band.
        float nl = clamp(ndl, 0.0, 1.0);
        wDeep = 0.0;
        wShadow = 1.0 - nl;
        wLit = nl;
    }

    // AmbientTex masks fold lit weight into shadow, and shadow into deep.
    wShadow = (wShadow + ambShadowMask * wLit) * (1.0 - ambDeepMask);
    wLit = wLit * (1.0 - ambShadowMask) * (1.0 - ambDeepMask);
    wDeep = mix(wDeep, 1.0, ambDeepMask);

    // The emission lerp scales the two shaded bands away and drives the lit band toward 1, so a
    // fully-masked texel ends up as plain unlit base colour.
    wShadow *= emissionLerp;
    wDeep *= emissionLerp;
    wLit = (wLit - 1.0) * emissionLerp + LightAmbient;

    vec3 finalRgb = (colShadow * wShadow
                   + colShadow * DeepShadowColor * wDeep
                   + colBase * wLit) * LightMul;

    if (DebugUV == 10)
    {
        fragColor = vec4(wDeep, wShadow, wLit, 1.0);
        return;
    }

    // ---- Specular: Blinn-Phong half-vector lobe, exactly the decoded shader's form
    //      (pow(max(dot(N,H),0), SpecularPower) * SpecularScale * SpecularColor, additive).
    //      Gated on SpecularScale alone, NOT SpecularMaskEnable: scanned all 154 base-form
    //      species in this romfs and SpecularMaskEnable is False everywhere, even on materials
    //      with real nonzero SpecularScale/SpecularPower (e.g. Beedrill's BodyA00, Scale=1).
    //      In the real shader that switch gates a separate mask TEXTURE lookup, not the term.
    if (SpecularScale > 0.0)
    {
        vec3 V2 = normalize(viewDirObj);
        vec3 H = normalize(L + V2);
        float specTerm = pow(max(dot(N, H), 0.0), max(SpecularPower, 1.0));

        // The scale is attenuated twice before it is used, and missing both is what made this
        // term read as a harsh white spotlight: SpecularPower is only 6 on these materials, so
        // the lobe is very wide, and an unattenuated white add over that much surface is a gloss
        // wash rather than a highlight.
        //   1. by the AmbientTex mask -- min(amb.r + amb.g, 1) zeroes specular where the
        //      ambient map marks occluded/deep-shadow area;
        //   2. by EmissionMaskTex.y, when SpecularMaskEnable says to.
        float specScale = SpecularScale
                        * (1.0 - min(ambDeepMask + ambShadowMask, 1.0))
                        * (1.0 - maskTexValue * float(SpecularMaskEnable));

        // BaseColorAddEnable (True on every material checked) multiplies the specular by the
        // already-shaded surface colour instead of leaving it white, so the highlight takes the
        // body's own hue and cannot blow a saturated surface out to white.
        vec3 specTint = mix(vec3(1.0), finalRgb, float(BaseColorAddEnable));
        finalRgb += SpecularColor * specTint * specTerm * specScale;
    }

    finalRgb += sphereAdd * (1.0 - maskTexValue * float(SphereMaskEnable));

    // ---- Rim: Fresnel lobe, then the ceiling clamp. The real shader does NOT just add the rim
    //      -- it takes min(colour + rim, colourBeforeRim * RimLimit) per channel, which is what
    //      stops the rim blowing a bright surface out to white. RimLimit is a genuine
    //      per-material value (cbuf_5[8].y == Values[33]).
    //      Rim colour is not a flat tint either: it is RimColorShadow..RimColor keyed off the
    //      lit amount, times a second RimColor..RimColorShadow term keyed off the ramp's own lit
    //      weight, so the rim only reaches full RimColor where the surface is lit.
    //      Gated on RimStrength alone, NOT RimMaskEnable: RimMaskEnable is True on only 2/514
    //      materials in this romfs while RimStrength/RimPower carry real nonzero values on
    //      452/514 -- same "modulate by a separate mask texture" meaning as SpecularMaskEnable.
    if (RimStrength > 0.0)
    {
        vec3 rimV = length(rimViewDir) > 0.001 ? normalize(rimViewDir) : vec3(0.0, 0.0, 1.0);
        float NdotV = max(dot(N, rimV), 0.0);
        float rimT = min(pow(clamp(1.0 - NdotV, 0.0, 1.0), max(RimPower, 1.0)) * RimStrength, 1.0);

        float litAmount = clamp(ndl, 0.0, 1.0);
        vec3 rimCol = mix(RimColorShadow, RimColor, litAmount)
                    * mix(RimColor, RimColorShadow, clamp(1.0 - wLit, 0.0, 1.0));

        float rimVal = RimColorVal * (1.0 - maskTexValue * float(RimMaskEnable));

        vec3 preRim = finalRgb;
        finalRgb = min(preRim + rimCol * rimT * rimVal, preRim * max(RimLimit, 1.0));
    }

    // The LGPE animation config maps 301DC1BFAB5062FD to pm0094_51_loop01.gfbanm.
    // Its material tracks animate MaskUVTransU/V; use those authored values and GroundEffectCol.
    if (IsMegaGengar == 1 && localPosition.y < 0.0)
        discard;

    if (IsMegaGengar == 1 && HasGengarMaskMap == 1)
    {
        vec2 gengarMaskUv = (f_texcoord0 - vec2(MaskUVTransU, MaskUVTransV))
                          * max(MaskUVScale, 0.001);
        vec4 gengarMask = texture(GengarMaskMap, gengarMaskUv);
        float maskValue = clamp(gengarMask.r + MaskAddVal, 0.0, 1.0);
        float bandWidth = max(TopLine - bottomLine, 0.001);
        float band = 1.0 - smoothstep(bottomLine, bottomLine + bandWidth,
                                      localPosition.y);
        float smoke = pow(maskValue, 1.0 / max(LerpPow, 0.001)) * band * topLineScale;
        finalRgb = mix(finalRgb, GroundEffectCol, clamp(smoke * 0.78, 0.0, 0.88));
    }

    if (IsFireHorn == 1)
    {
        // Magmar's FireHorn texture (pm0126_00_FireHorn_col) already contains the authored
        // orange-to-yellow gradient. Keep it self-luminous with a warm golden flame shimmer.
        float wave1 = sin(u_time * 5.0 - diffuseUV.y * 10.0);
        float wave2 = cos(u_time * 3.5 + diffuseUV.x * 6.0);
        float shimmer = 0.5 + 0.5 * (wave1 * 0.6 + wave2 * 0.4);
        
        // Fresnel edge glow for warm plasma/fire envelope (warm golden-yellow, no white bleaching)
        vec3 V = length(rimViewDir) > 0.001 ? normalize(rimViewDir) : vec3(0.0, 0.0, 1.0);
        float NdotV = clamp(dot(N, V), 0.0, 1.0);
        float fresnel = pow(1.0 - NdotV, 2.5);
        
        vec3 warmCorona = vec3(1.0, 0.82, 0.15) * (fresnel * 0.35 + shimmer * 0.15);
        
        // Self-luminous: brighten the textured albedo and add the warm golden corona
        vec3 luminousHorn = albedo * 1.25 + warmCorona;
        finalRgb = mix(luminousHorn, finalRgb, 0.15);
    }

    // Blended materials use diffuse alpha as coverage. Eye materials may already use alpha to select layers, so only unclaimed alpha controls coverage.
    bool alphaIsLayerMask = (HasOverlayMap == 1 && SwitchPriority == 1);

    float outAlpha = 1.0;
    if (AlphaBlendEnable == 1 && HasDiffuse == 1 && !alphaIsLayerMask)
    {
        if (diffuseSample.a < 0.004)
            discard;
        outAlpha = diffuseSample.a;
    }

    // Apply the shader's final EffectTex, ConstantColor, OnGameEmissionVal, and OnGameColor controls.
    vec3 effectScale = vec3(1.0);
    if (HasEffectMap == 1 && EffectVal == 1)
    {
        // Sampled at the constant coordinate the decoded shader uses, not at the surface UV.
        effectScale += texture(EffectMap, vec2(0.0, 1.0)).rgb;
    }
    vec3 tinted = finalRgb * effectScale;
    tinted = mix(tinted, tinted * ConstantColor, ConstantColorVal);
    finalRgb = mix(finalRgb * OnGameEmissionVal, tinted, emissionLerp);
    finalRgb = mix(finalRgb, finalRgb * OnGameColor, OnGameColorVal);

    outAlpha = mix(outAlpha, outAlpha * ConstantAlpha, emissionLerp) * OnGameAlpha;

    // Encode linear lighting once on output for the non-sRGB framebuffer.
    fragColor = vec4(pow(clamp(finalRgb, 0.0, 1.0), vec3(1.0 / 2.2)), clamp(outAlpha, 0.0, 1.0));
}
