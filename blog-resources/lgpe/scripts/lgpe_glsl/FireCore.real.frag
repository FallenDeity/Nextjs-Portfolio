#version 450

// Fragment SSBO bindings are offset to avoid vertex-stage collisions after GL linking.
layout(binding = 10, std430) readonly buffer cbuf_1
{
    vec4 _m0[4096];
} cbuf_1_1;

layout(binding = 11, std430) readonly buffer cbuf_3_frag
{
    vec4 _m0[4096];
} cbuf_3_1;

layout(binding = 12, std430) readonly buffer cbuf_4_frag
{
    vec4 _m0[4096];
} cbuf_4_1;

layout(binding = 13, std430) readonly buffer cbuf_5
{
    vec4 _m0[4096];
} cbuf_5_1;

uniform sampler2D SPIRV_Cross_Combinedtexture_0SPIRV_Cross_DummySampler;
// Enable mask sampling only when this model produced a FireMask target.
uniform float u_useFireMask;
uniform float u_coreDebugMode;
uniform sampler2D SPIRV_Cross_Combinedtexture_1sampler_1;
uniform sampler2D SPIRV_Cross_Combinedtexture_2sampler_2;
uniform sampler2D SPIRV_Cross_Combinedtexture_3sampler_3;

layout(location = 0) out vec4 frag_color0;
layout(location = 1) in vec4 in_attr1;
layout(location = 2) in vec4 in_attr2;
layout(location = 3) in vec4 in_attr3;
float gpr_0 = 0.0;
float gpr_1 = 0.0;
float gpr_2 = 0.0;
float gpr_3 = 0.0;
float gpr_4 = 0.0;
float gpr_5 = 0.0;
float gpr_6 = 0.0;
float gpr_7 = 0.0;
float gpr_8 = 0.0;
float gpr_9 = 0.0;
float gpr_10 = 0.0;
float gpr_11 = 0.0;
float gpr_12 = 0.0;
float gpr_13 = 0.0;
float gpr_14 = 0.0;
float gpr_256 = 0.0;
float gpr_257 = 0.0;
float _dbgBlendFactor = 0.0;
float _dbgRim = 0.0;
float _dbgLerpTex = 0.0;
float _dbgBlend0 = 0.0;
float _dbgBlend1x = 0.0;
float _dbgBlend1w = 0.0;
float _dbgMaskX = 0.0;
float _dbgMaskIdMatch = 0.0;
bool pred_0 = false;
bool zero = false;
bool _sign = false;
bool carry = false;
bool overflow = false;

void main()
{
    gpr_2 = cbuf_4_1._m0[4u].x;
    gpr_0 = gl_FragCoord.x;
    gpr_12 = cbuf_4_1._m0[2u].w;
    gpr_1 = gl_FragCoord.y;
    // MaskTex is a runtime target: .x is coverage and .y is material ID. Compare IDs before using coverage for alpha.
    vec4 _fireMask = texelFetch(SPIRV_Cross_Combinedtexture_0SPIRV_Cross_DummySampler, ivec2(int(gpr_0), int(gpr_1)), 0);
    gpr_4 = mix(uintBitsToFloat(1065353216u), _fireMask.x, u_useFireMask);
    gpr_5 = mix(cbuf_4_1._m0[4u].x * cbuf_1_1._m0[0u].x, _fireMask.y, u_useFireMask);
    _dbgMaskX = gpr_4;
    gpr_9 = gl_FragCoord.w;
    precise float _154 = uintBitsToFloat(1065353216u) / gpr_9;
    gpr_0 = _154;
    gpr_6 = (in_attr2.y * gl_FragCoord.w) * gpr_0;
    gpr_1 = (in_attr1.x * gl_FragCoord.w) * gpr_0;
    gpr_8 = (in_attr1.y * gl_FragCoord.w) * gpr_0;
    gpr_10 = (in_attr1.z * gl_FragCoord.w) * gpr_0;
    precise float _188 = (-gpr_6) + cbuf_3_1._m0[19u].y;
    gpr_6 = _188;
    precise float _191 = gpr_1 * gpr_1;
    gpr_7 = _191;
    gpr_7 = fma(gpr_8, gpr_8, gpr_7);
    gpr_11 = fma(gpr_10, gpr_10, gpr_7);
    gpr_11 = inversesqrt(gpr_11);
    precise float _204 = gpr_1 * gpr_11;
    gpr_1 = _204;
    gpr_13 = cbuf_4_1._m0[1u].w;
    precise float _209 = gpr_8 * gpr_11;
    gpr_8 = _209;
    precise float _212 = gpr_10 * gpr_11;
    gpr_10 = _212;
    gpr_14 = cbuf_4_1._m0[2u].y;
    precise float _218 = gpr_12 * cbuf_4_1._m0[3u].x;
    gpr_12 = _218;
    precise float _222 = gpr_13 * cbuf_4_1._m0[2u].x;
    gpr_11 = _222;
    precise float _226 = gpr_14 * cbuf_4_1._m0[2u].z;
    gpr_14 = _226;
    gpr_5 = fma(gpr_2, -cbuf_1_1._m0[0u].x, gpr_5);
    gpr_2 = (in_attr2.x * gl_FragCoord.w) * gpr_0;
    gpr_3 = ((abs(gpr_5) < cbuf_1_1._m0[0u].y) && true) ? uintBitsToFloat(1065353216u) : uintBitsToFloat(0u);
    _dbgMaskIdMatch = gpr_3;
    gpr_5 = (in_attr2.z * gl_FragCoord.w) * gpr_0;
    precise float _258 = gpr_3 * gpr_4;
    gpr_3 = _258;
    precise float _262 = gpr_3 * cbuf_4_1._m0[3u].z;
    gpr_3 = _262;
    pred_0 = (gpr_3 <= cbuf_4_1._m0[4u].y) && true;
    if (pred_0)
    {
        discard;
    }
    precise float _275 = (-gpr_2) + cbuf_3_1._m0[19u].x;
    gpr_2 = _275;
    precise float _278 = gpr_2 * gpr_2;
    gpr_4 = _278;
    precise float _283 = (-gpr_5) + cbuf_3_1._m0[19u].z;
    gpr_5 = _283;
    gpr_4 = fma(gpr_6, gpr_6, gpr_4);
    gpr_4 = fma(gpr_5, gpr_5, gpr_4);
    gpr_7 = inversesqrt(gpr_4);
    precise float _296 = gpr_2 * gpr_7;
    gpr_2 = _296;
    precise float _299 = gpr_2 * gpr_1;
    gpr_9 = _299;
    gpr_2 = (in_attr3.y * gl_FragCoord.w) * gpr_0;
    gpr_4 = cbuf_4_1._m0[1u].y;
    gpr_1 = (in_attr3.x * gl_FragCoord.w) * gpr_0;
    precise float _319 = gpr_4 * cbuf_4_1._m0[1u].z;
    gpr_4 = _319;
    gpr_12 = fma(gpr_2, cbuf_4_1._m0[2u].w, -gpr_12);
    gpr_11 = fma(gpr_2, cbuf_4_1._m0[1u].w, -gpr_11);
    precise float _335 = (-gpr_2) + uintBitsToFloat(1065353216u);
    gpr_0 = _335;
    gpr_2 = fma(gpr_1, cbuf_4_1._m0[1u].y, -gpr_4);
    gpr_13 = fma(gpr_1, cbuf_4_1._m0[2u].y, -gpr_14);
    precise float _351 = (-gpr_12) + uintBitsToFloat(1065353216u);
    gpr_4 = _351;
    precise float _355 = (-gpr_11) + uintBitsToFloat(1065353216u);
    gpr_11 = _355;
    gpr_256 = texture(SPIRV_Cross_Combinedtexture_1sampler_1, vec2(gpr_13, gpr_4)).x;
    gpr_4 = gpr_256;
    gpr_256 = texture(SPIRV_Cross_Combinedtexture_2sampler_2, vec2(gpr_2, gpr_11)).x;
    gpr_2 = gpr_256;
    gpr_256 = texture(SPIRV_Cross_Combinedtexture_3sampler_3, vec2(gpr_1, gpr_0)).x;
    gpr_257 = texture(SPIRV_Cross_Combinedtexture_3sampler_3, vec2(gpr_1, gpr_0)).w;
    gpr_0 = gpr_256;
    gpr_1 = gpr_257;
    _dbgLerpTex = gpr_4;
    _dbgBlend0 = gpr_2;
    _dbgBlend1x = gpr_0;
    _dbgBlend1w = gpr_1;
    precise float _394 = gpr_6 * gpr_7;
    gpr_6 = _394;
    precise float _397 = gpr_5 * gpr_7;
    gpr_5 = _397;
    gpr_8 = fma(gpr_6, gpr_8, gpr_9);
    gpr_5 = fma(gpr_5, gpr_10, gpr_8);
    gpr_5 = (!true) ? min(0.0, gpr_5) : max(0.0, gpr_5);
    gpr_6 = cbuf_5_1._m0[2u].x;
    precise float _417 = (-gpr_5) + uintBitsToFloat(1065353216u);
    gpr_5 = _417;
    gpr_5 = log2(abs(gpr_5));
    precise float _425 = (-gpr_6) + cbuf_5_1._m0[3u].x;
    gpr_7 = _425;
    gpr_9 = cbuf_5_1._m0[2u].y;
    gpr_11 = cbuf_5_1._m0[2u].z;
    gpr_7 = fma(gpr_7, cbuf_4_1._m0[0u].x, gpr_6);
    precise float _439 = (-gpr_9) + cbuf_5_1._m0[3u].y;
    gpr_10 = _439;
    gpr_12 = cbuf_5_1._m0[0u].x;
    precise float _445 = gpr_5 * cbuf_4_1._m0[0u].z;
    gpr_6 = _445;
    precise float _450 = (-gpr_11) + cbuf_5_1._m0[3u].z;
    gpr_8 = _450;
    gpr_10 = fma(gpr_10, cbuf_4_1._m0[0u].x, gpr_9);
    precise float _460 = (-gpr_12) + cbuf_5_1._m0[1u].x;
    gpr_9 = _460;
    gpr_13 = gpr_6;
    gpr_6 = cbuf_5_1._m0[0u].y;
    gpr_5 = exp2(gpr_13);
    gpr_8 = fma(gpr_8, cbuf_4_1._m0[0u].x, gpr_11);
    gpr_12 = fma(gpr_9, cbuf_4_1._m0[0u].x, gpr_12);
    gpr_9 = cbuf_5_1._m0[0u].z;
    precise float _482 = (-gpr_6) + cbuf_5_1._m0[1u].y;
    gpr_11 = _482;
    gpr_11 = fma(gpr_11, cbuf_4_1._m0[0u].x, gpr_6);
    precise float _491 = gpr_5 * cbuf_4_1._m0[0u].w;
    gpr_5 = _491;
    precise float _496 = (-gpr_9) + cbuf_5_1._m0[1u].z;
    gpr_6 = _496;
    gpr_5 = true ? min(gpr_5, uintBitsToFloat(1065353216u)) : max(gpr_5, uintBitsToFloat(1065353216u));
    _dbgRim = gpr_5;
    gpr_6 = fma(gpr_6, cbuf_4_1._m0[0u].x, gpr_9);
    gpr_7 = fma(gpr_5, cbuf_4_1._m0[1u].x, gpr_7);
    gpr_10 = fma(gpr_5, cbuf_4_1._m0[1u].x, gpr_10);
    gpr_8 = fma(gpr_5, cbuf_4_1._m0[1u].x, gpr_8);
    gpr_12 = fma(gpr_5, cbuf_4_1._m0[0u].y, gpr_12);
    gpr_11 = fma(gpr_5, cbuf_4_1._m0[0u].y, gpr_11);
    gpr_5 = fma(gpr_5, cbuf_4_1._m0[0u].y, gpr_6);
    precise float _542 = gpr_7 + (-gpr_12);
    gpr_7 = _542;
    precise float _546 = gpr_10 + (-gpr_11);
    gpr_10 = _546;
    precise float _550 = gpr_8 + (-gpr_5);
    gpr_8 = _550;
    precise float _553 = gpr_4 + gpr_2;
    gpr_2 = _553;
    gpr_1 = fma(gpr_2, -gpr_1, gpr_2);
    precise float _561 = gpr_0 + gpr_1;
    gpr_0 = _561;
    gpr_1 = true ? min(gpr_0, uintBitsToFloat(1065353216u)) : max(gpr_0, uintBitsToFloat(1065353216u));
    _dbgBlendFactor = gpr_1;
    gpr_7 = fma(gpr_7, gpr_1, gpr_12);
    gpr_10 = fma(gpr_10, gpr_1, gpr_11);
    gpr_1 = fma(gpr_8, gpr_1, gpr_5);
    gpr_0 = fma(gpr_7, cbuf_5_1._m0[5u].x, -gpr_7);
    gpr_4 = fma(gpr_10, cbuf_5_1._m0[5u].y, -gpr_10);
    gpr_2 = fma(gpr_1, cbuf_5_1._m0[5u].z, -gpr_1);
    gpr_0 = fma(gpr_0, cbuf_4_1._m0[4u].z, gpr_7);
    gpr_4 = fma(gpr_4, cbuf_4_1._m0[4u].z, gpr_10);
    gpr_1 = fma(gpr_2, cbuf_4_1._m0[4u].z, gpr_1);
    precise float _618 = gpr_0 * cbuf_4_1._m0[3u].w;
    gpr_0 = _618;
    precise float _622 = gpr_4 * cbuf_4_1._m0[3u].w;
    gpr_4 = _622;
    precise float _626 = gpr_1 * cbuf_4_1._m0[3u].w;
    gpr_2 = _626;
    gpr_1 = fma(gpr_0, cbuf_5_1._m0[4u].x, -gpr_0);
    gpr_5 = fma(gpr_4, cbuf_5_1._m0[4u].y, -gpr_4);
    gpr_7 = fma(gpr_2, cbuf_5_1._m0[4u].z, -gpr_2);
    gpr_0 = fma(gpr_1, cbuf_4_1._m0[3u].y, gpr_0);
    gpr_1 = fma(gpr_5, cbuf_4_1._m0[3u].y, gpr_4);
    gpr_2 = fma(gpr_7, cbuf_4_1._m0[3u].y, gpr_2);
    frag_color0.x = gpr_0;
    frag_color0.y = gpr_1;
    frag_color0.z = gpr_2;
    frag_color0.w = gpr_3;

    // Encode linear output for the non-sRGB framebuffer.
    frag_color0.rgb = pow(max(frag_color0.rgb, vec3(0.0)), vec3(1.0 / 2.2));

    if (gpr_3 <= 0.001)
        discard;

    if (u_coreDebugMode >= 0.5)
    {
        float v = _dbgBlendFactor;
        if (u_coreDebugMode >= 7.5)      v = u_useFireMask;
        else if (u_coreDebugMode >= 6.5) v = _dbgMaskIdMatch;
        else if (u_coreDebugMode >= 5.5) v = _dbgMaskX;
        else if (u_coreDebugMode >= 4.5) v = _dbgBlend1x;
        else if (u_coreDebugMode >= 3.5) v = _dbgBlend0;
        else if (u_coreDebugMode >= 2.5) v = _dbgLerpTex;
        else if (u_coreDebugMode >= 1.5) v = _dbgRim;
        frag_color0 = vec4(v, v, v, gpr_3);
    }
}

