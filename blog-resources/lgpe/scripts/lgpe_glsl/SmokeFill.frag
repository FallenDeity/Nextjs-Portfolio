#version 330

// Renderer-authored smoke-mask prefill; output channels match the other mask passes.
// .x/.w hold coverage; .y holds the object ID.

in vec2 v_uv;

uniform sampler2D u_blob;
uniform float u_id;
uniform float u_intensity;
// Screen-space center and half-extents of the smoke shell.
uniform vec2 u_center;
uniform vec2 u_half;
// Radius where the atlas cell begins shaping the cloud edge.
uniform float u_edge;
// Fractional radius where the cloud fades out.
uniform float u_feather;

out vec4 frag_color0;

void main()
{
        // Map screen position into the smoke shell's local coordinates.
    vec2 q = (v_uv * 2.0 - 1.0 - u_center) / max(u_half, vec2(1e-4));
        // Flip V because atlas rows are top-down while NDC is bottom-up.
    vec2 uv = vec2(q.x * 0.5 + 0.5, 0.5 - q.y * 0.5);
    float r = length(q);
    float b = texture(u_blob, uv).x;
        // Shape only the cloud rim; keep its interior coverage solid.
    if (u_edge > 0.0)
        b = mix(1.0, b, smoothstep(u_edge, 1.0, r));
        // Fade the outer edge to avoid a hard silhouette.
    b *= 1.0 - smoothstep(u_feather, 1.06, r);
    frag_color0 = vec4(b * u_intensity, b > 0.004 ? u_id : 0.0, 0.0, b);
}
