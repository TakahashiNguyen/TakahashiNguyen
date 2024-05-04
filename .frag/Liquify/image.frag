void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 a = texture(iChannel1, uv).xy;
    fragColor = vec4(texture(iChannel0, a).rgb, 1.0);
}