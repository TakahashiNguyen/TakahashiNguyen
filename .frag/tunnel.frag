void main()
{
    vec2 p = gl_FragCoord.xy / iResolution.xy;
    vec2 q = p - vec2(0.5, 0.5);

    q.x += sin(iTime * 0.6) * 0.2;
    q.y += cos(iTime * 0.4) * 0.3;

    float len = length(q);

    float a = atan(q.y, q.x) + iTime * 0.3;
    float b = atan(q.y, q.x) + iTime * 0.3;
    float r1 = 0.3 / len + iTime * 0.5;
    float r2 = 0.2 / len + iTime * 0.5;

    float m = (1.0 + sin(iTime * 0.5)) / 2.0;
    vec4 tex1 = texture(iChannel0, vec2(a + 0.1 / len, r1));
    vec4 tex2 = texture(iChannel1, vec2(b + 0.1 / len, r2));
    vec3 col = vec3(mix(tex1, tex2, m));
    gl_FragColor = vec4(col * len * 1.5, 1.0);
}
