// UV texture
#define mousedata(a, b) texture(iChannel1, (0.5 + vec2(a, b)) / iChannelResolution[0].xy, -100.0)
#define backbuffer(uv) texture(iChannel0, uv).xy
// https://www.shadertoy.com/view/4dfXDn
float lineDist(vec2 p, vec2 start, vec2 end, float width)
{
    vec2 dir = start - end;
    float lngth = length(dir);
    dir /= lngth;
    vec2 proj = max(0.0, min(lngth, dot((start - p), dir))) * dir;
    return length((start - p) - proj) - (width / 2.0);
}
void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec2 uv = fragCoord.xy / iResolution.xy;
    vec2 col = uv;
    if (iFrame != 0)
    {
        col = texture(iChannel0, uv).xy;
        vec2 mouse = iMouse.xy / iResolution.xy;
        vec2 p_mouse = mousedata(2., 0.).xy;
        if (mousedata(4., 0.).x > 0.)
        { // Pressed, Using old mouse press because mouse position doesn't update unless you click. So it won't liquify intense each click.
            col = backbuffer(uv + ((p_mouse - mouse) * clamp(1. - (lineDist(uv, mouse, p_mouse, 0.) * 20.), 0., 1.) * .7));
            // col += (p_mouse-mouse)*clamp(1.-(lineDist(uv,mouse,p_mouse,0.)*20.),0.,1.)*.7;
        }
    }
    fragColor = vec4(col, 0.0, 1.0);
}