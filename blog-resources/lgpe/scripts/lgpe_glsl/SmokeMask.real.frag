#version 450

// Uses one model-UV mask to gate a separate screen-space sample; FireMask uses two UV masks.
// cbuf_3[0] = ScaleUV, MatLinkID, transU, transV; cbuf_3[1].x = discard threshold.
// cbuf_4[0].x = intensity.
// Fragment SSBO bindings are offset to avoid collisions after GL linking.

layout(binding = 10, std430) readonly buffer cbuf_3_frag
{
    vec4 _m0[4096];
} cbuf_3_1;

layout(binding = 11, std430) readonly buffer cbuf_4_frag
{
    vec4 _m0[4096];
} cbuf_4_1;

uniform sampler2D SPIRV_Cross_Combinedtexture_0sampler_0;
uniform sampler2D SPIRV_Cross_Combinedtexture_1sampler_1;

// Debug mode exposes the mask and projected-sample channels.
uniform float u_maskDebugNoDiscard;

// The renderer supplies a scene mask and procedural screen-space sample in place of the engine's runtime projection buffer.
uniform sampler2D u_sceneMask;
uniform vec2 u_sceneMaskTexel;
uniform float u_useSceneMask;
// Enable when mask meshes punch holes in the smoke instead of drawing its silhouette.
uniform float u_punchOnly;
// Tap spacing in texels: how far the gas fades inside the body outline.
uniform float u_sceneMaskSoft;

// 0 keeps smoke in the background; 1 keeps only smoke in front of body depth.
// Gastly uses the first mode; Koffing and Weezing use depth occlusion.
uniform float u_depthOcclude;
layout(location = 0) out vec4 frag_color0;
layout(location = 1) in vec4 in_attr1;
layout(location = 4) in vec4 in_attr4;
float gpr_0 = 0.0;
float gpr_1 = 0.0;
float gpr_2 = 0.0;
float gpr_3 = 0.0;
float gpr_4 = 0.0;
float gpr_5 = 0.0;
float gpr_6 = 0.0;
float gpr_7 = 0.0;
float gpr_256 = 0.0;
float gpr_257 = 0.0;
float _dbgT1x = 0.0;
float _dbgT1y = 0.0;
bool pred_0 = false;
bool zero = false;
bool _sign = false;
bool carry = false;
bool overflow = false;

void main()
{
    gpr_6 = uintBitsToFloat(1056964608u);
    gpr_4 = gl_FragCoord.w;
    precise float _102 = uintBitsToFloat(1065353216u) / gpr_4;
    gpr_7 = _102;
    gpr_0 = (in_attr4.y * gl_FragCoord.w) * gpr_7;
    gpr_1 = (in_attr4.x * gl_FragCoord.w) * gpr_7;
    precise float _121 = gpr_0 + cbuf_3_1._m0[0u].w;
    gpr_0 = _121;
    precise float _126 = gpr_1 + cbuf_3_1._m0[0u].z;
    gpr_5 = _126;
    precise float _130 = (-gpr_0) + uintBitsToFloat(1065353216u);
    gpr_3 = _130;
    gpr_256 = texture(SPIRV_Cross_Combinedtexture_0sampler_0, vec2(gpr_5, gpr_3)).x;
    gpr_3 = gpr_256;
    gpr_2 = (in_attr1.w * gl_FragCoord.w) * gpr_7;
    gpr_1 = (in_attr1.y * gl_FragCoord.w) * gpr_7;
    gpr_0 = (in_attr1.x * gl_FragCoord.w) * gpr_7;
    precise float _163 = uintBitsToFloat(1065353216u) / gpr_2;
    gpr_2 = _163;
    precise float _168 = (gpr_1 * uintBitsToFloat(1056964608u)) * gpr_2;
    gpr_1 = _168;
    precise float _173 = (gpr_0 * uintBitsToFloat(1056964608u)) * gpr_2;
    gpr_0 = _173;
    gpr_1 = fma(gpr_1, cbuf_3_1._m0[0u].x, gpr_6);
    gpr_4 = fma(gpr_0, cbuf_3_1._m0[0u].x, gpr_6);
    precise float _188 = (-gpr_1) + uintBitsToFloat(1065353216u);
    gpr_5 = _188;
    pred_0 = (gpr_3 <= cbuf_3_1._m0[1u].x) && true;
    if (pred_0 && u_maskDebugNoDiscard < 0.5)
    {
        discard;
    }
    gpr_256 = texture(SPIRV_Cross_Combinedtexture_1sampler_1, vec2(gpr_4, gpr_5)).x;
    gpr_257 = texture(SPIRV_Cross_Combinedtexture_1sampler_1, vec2(gpr_4, gpr_5)).y;
    gpr_0 = gpr_256;
    gpr_1 = gpr_257;

    if (u_useSceneMask > 0.5)
    {
        // Flip the projected UV for the plain GL snapshot.
        vec2 _sUV = vec2(gpr_4, 1.0 - gpr_5);
        // Nearby taps soften the silhouette edge.
        float _bg = 0.0;
        if (u_depthOcclude > 0.5)
        {
            // Keep where this fragment is nearer than whatever the body wrote. Background is
            // depth 1.0, so open space always passes.
            // Use a tiny bias because distant scene depth values cluster near 1.0.
            float bodyDepth = texture(u_sceneMask, _sUV).x;
            _bg = gl_FragCoord.z <= bodyDepth + 0.000002 ? 1.0 : 0.0;
        }
        else if (u_sceneMaskSoft <= 0.0)
        {
            // A single tap preserves the exact body silhouette; averaging expands it and creates a halo.
            _bg = step(0.99999, texture(u_sceneMask, _sUV).x);
        }
        else
        for (int _sy = -2; _sy <= 2; _sy++)
        {
            for (int _sx = -2; _sx <= 2; _sx++)
            {
                vec2 _o = vec2(float(_sx), float(_sy)) * u_sceneMaskTexel * u_sceneMaskSoft;
                // >= 1.0 means nothing solid was drawn at this pixel.
                _bg += step(0.99999, texture(u_sceneMask, _sUV + _o).x);
            }
        }
        if (u_sceneMaskSoft > 0.0) _bg /= 25.0;
        // Only the coverage channel is keyed. The id channel (gpr_1) has to reach the mask
        // target unscaled or FireCore's object-id comparison stops matching.
        gpr_0 *= _bg;

        // Discard hole-punch fragments over the body so they only cut the smoke mask.
        if (u_punchOnly > 0.5 && _bg > 0.5)
            discard;
    }

    _dbgT1x = gpr_0;
    _dbgT1y = gpr_1;
    gpr_6 = cbuf_3_1._m0[0u].y;
    precise float _220 = gpr_6 * uintBitsToFloat(964691969u);
    gpr_6 = _220;
    gpr_2 = 0.0;
    precise float _223 = gpr_1 * gpr_3;
    gpr_1 = _223;
    precise float _226 = gpr_0 * gpr_3;
    gpr_0 = _226;
    precise float _229 = gpr_1 * gpr_6;
    gpr_1 = _229;
    precise float _233 = gpr_0 * cbuf_4_1._m0[0u].x;
    gpr_0 = _233;
    frag_color0.x = gpr_0;
    frag_color0.y = gpr_1;
    frag_color0.z = gpr_2;
    frag_color0.w = gpr_3;

    if (u_maskDebugNoDiscard >= 0.5)
    {
        frag_color0.x = gpr_3;
        frag_color0.y = _dbgT1x;
        frag_color0.z = 1.0;
        frag_color0.w = _dbgT1y;
    }
}

