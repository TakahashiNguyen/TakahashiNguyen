// Mouse data
#define pixel_at(a, b) floor(fragCoord.x) == a &&floor(fragCoord.y) == b
// #define backbuffer(a,b) texture(iChannel0,vec2(a,b)/floor(iChannelResolution[0].xy))
// IQ's loading function
#define backbuffer(a, b) texture(iChannel0, (0.5 + vec2(a, b)) / iChannelResolution[0].xy, -100.0)
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec4 color = texture(iChannel0, uv);
    if (pixel_at(0., 0.))
    { // Surface position
        fragColor = vec4(backbuffer(0., 0.).rg + (backbuffer(4., 0.).r * (backbuffer(2., 0.).rg - backbuffer(1., 0.).rg)), 0., 1.);
    }
    else if (pixel_at(1., 0.))
    { // New mouse position
        fragColor = vec4(iMouse.xy / iResolution.xy, 0., 1.);
    }
    else if (pixel_at(2., 0.))
    { // Old mouse position
        fragColor = vec4(backbuffer(1., 0.).rg, 0., 1.);
    }
    else if (pixel_at(3., 0.))
    { // New mouse holded
        fragColor = vec4(clamp(iMouse.z, 0., 1.), 0., 0., 1.);
    }
    else if (pixel_at(4., 0.))
    { // Old mouse holded
        fragColor = vec4(backbuffer(3., 0.).r, 0., 0., 1.);
    }
    else
    {
        fragColor = vec4(0., 0., 0., 1.);
    }
}