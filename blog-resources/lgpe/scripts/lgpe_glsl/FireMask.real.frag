#version 450

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

uniform float u_maskDebugNoDiscard;
layout(location = 0) out vec4 frag_color0;
layout(location = 2) in vec4 in_attr2;
float gpr_0 = 0.0;
float gpr_1 = 0.0;
float gpr_2 = 0.0;
float gpr_3 = 0.0;
float gpr_4 = 0.0;
float gpr_5 = 0.0;
float gpr_6 = 0.0;
float gpr_256 = 0.0;
float _dbgMask0 = 0.0;
float _dbgMask1 = 0.0;
float _dbgU = 0.0;
vec4 _dbgTex0 = vec4(0.0);
bool pred_0 = false;
bool zero = false;
bool _sign = false;
bool carry = false;
bool overflow = false;

void main()
{
    gpr_0 = cbuf_3_1._m0[1u].z;
    gpr_6 = gl_FragCoord.w;
    precise float _101 = uintBitsToFloat(1065353216u) / gpr_6;
    gpr_6 = _101;
    gpr_1 = (in_attr2.y * gl_FragCoord.w) * gpr_6;
    gpr_3 = (in_attr2.x * gl_FragCoord.w) * gpr_6;
    gpr_4 = cbuf_3_1._m0[0u].z;
    gpr_2 = cbuf_3_1._m0[1u].x;
    gpr_5 = cbuf_3_1._m0[0u].x;
    precise float _125 = gpr_0 * cbuf_3_1._m0[1u].w;
    gpr_0 = _125;
    precise float _129 = gpr_4 * cbuf_3_1._m0[0u].w;
    gpr_4 = _129;
    precise float _133 = gpr_2 * cbuf_3_1._m0[1u].y;
    gpr_2 = _133;
    precise float _137 = gpr_5 * cbuf_3_1._m0[0u].y;
    gpr_5 = _137;
    gpr_0 = fma(gpr_1, cbuf_3_1._m0[1u].z, -gpr_0);
    gpr_1 = fma(gpr_1, cbuf_3_1._m0[0u].z, -gpr_4);
    gpr_4 = fma(gpr_3, cbuf_3_1._m0[1u].x, -gpr_2);
    gpr_5 = fma(gpr_3, cbuf_3_1._m0[0u].x, -gpr_5);
    precise float _166 = (-gpr_0) + uintBitsToFloat(1065353216u);
    gpr_3 = _166;
    precise float _170 = (-gpr_1) + uintBitsToFloat(1065353216u);
    gpr_6 = _170;
    gpr_256 = texture(SPIRV_Cross_Combinedtexture_0sampler_0, vec2(gpr_4, gpr_3)).x;
    gpr_3 = gpr_256;
    gpr_256 = texture(SPIRV_Cross_Combinedtexture_1sampler_1, vec2(gpr_5, gpr_6)).x;
    gpr_5 = gpr_256;
    _dbgMask0 = gpr_3;
    _dbgMask1 = gpr_5;
    _dbgU = gpr_4;
    _dbgTex0 = texture(SPIRV_Cross_Combinedtexture_0sampler_0, vec2(gpr_4, gpr_3));
    gpr_1 = cbuf_3_1._m0[2u].x;
    precise float _194 = gpr_1 * uintBitsToFloat(964691969u);
    gpr_1 = _194;
    gpr_2 = 0.0;
    // MaskCalcMode in cbuf_3[2].z: 1 = Multiply (mask0 * mask1 for Moltres), 0 = Add (min(mask0 + mask1, 1) for other fire models)
    if (cbuf_3_1._m0[2u].z > 0.5)
        gpr_0 = gpr_3 * gpr_5;
    else
        gpr_0 = gpr_3 + gpr_5;
    gpr_3 = true ? min(gpr_0, uintBitsToFloat(1065353216u)) : max(gpr_0, uintBitsToFloat(1065353216u));
    pred_0 = (gpr_3 <= cbuf_3_1._m0[2u].y) && true;
    precise float _212 = gpr_3 * gpr_1;
    gpr_1 = _212;
    if (pred_0 && u_maskDebugNoDiscard < 0.5)
    {
        discard;
    }
    precise float _219 = gpr_3 * cbuf_4_1._m0[0u].x;
    gpr_0 = _219;
    frag_color0.x = gpr_0;
    frag_color0.y = gpr_1;
    frag_color0.z = gpr_2;
    frag_color0.w = gpr_3;

    if (u_maskDebugNoDiscard >= 0.5)
    {
        frag_color0.x = _dbgMask0;
        frag_color0.y = _dbgMask1;
        frag_color0.z = 1.0;
        frag_color0.w = _dbgU;
        if (u_maskDebugNoDiscard >= 1.5)
        {
            frag_color0.x = _dbgTex0.y;
            frag_color0.y = _dbgTex0.z;
            frag_color0.w = _dbgTex0.w;
        }
    }
}

