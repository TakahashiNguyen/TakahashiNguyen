float DigitBin(const int x)
{
    return x == 0 ? 480599.0 : x == 1 ? 139810.0
                           : x == 2   ? 476951.0
                           : x == 3   ? 476999.0
                           : x == 4   ? 350020.0
                           : x == 5   ? 464711.0
                           : x == 6   ? 464727.0
                           : x == 7   ? 476228.0
                           : x == 8   ? 481111.0
                           : x == 9   ? 481095.0
                                      : 0.0;
}

float PrintValue(vec2 vStringCoords, float fValue, float fMaxDigits, float fDecimalPlaces)
{
    if ((vStringCoords.y < 0.0) || (vStringCoords.y >= 1.0))
        return 0.0;

    bool bNeg = (fValue < 0.0);
    fValue = abs(fValue);

    float fLog10Value = log2(abs(fValue)) / log2(10.0);
    float fBiggestIndex = max(floor(fLog10Value), 0.0);
    float fDigitIndex = fMaxDigits - floor(vStringCoords.x);
    float fCharBin = 0.0;
    if (fDigitIndex > (-fDecimalPlaces - 1.01))
    {
        if (fDigitIndex > fBiggestIndex)
        {
            if ((bNeg) && (fDigitIndex < (fBiggestIndex + 1.5)))
                fCharBin = 1792.0;
        }
        else
        {
            if (fDigitIndex == -1.0)
            {
                if (fDecimalPlaces > 0.0)
                    fCharBin = 2.0;
            }
            else
            {
                float fReducedRangeValue = fValue;
                if (fDigitIndex < 0.0)
                {
                    fReducedRangeValue = fract(fValue);
                    fDigitIndex += 1.0;
                }
                float fDigitValue = (abs(fReducedRangeValue / (pow(10.0, fDigitIndex))));
                fCharBin = DigitBin(int(floor(mod(fDigitValue, 10.0))));
            }
        }
    }
    return floor(mod((fCharBin / pow(2.0, floor(fract(vStringCoords.x) * 4.0) + (floor(vStringCoords.y * 5.0) * 4.0))), 2.0));
}

void mainImage(out vec4 fragColor, in vec2 fragCoord)
{
    vec3 vColour = vec3(0);
    vec2 vFontSize = vec2(8.0, 15.0);
    float fDigits;
    float fDecimalPlaces;

    vColour = mix(vColour, vec3(1.0, 0.0, 1.0), PrintValue((fragCoord - vec2(184.0, 5.0)) / vFontSize, mod(iDate.w / (60.0 * 60.0), 12.0), 2.0, 0.0));
    vColour = mix(vColour, vec3(1.0, 0.0, 1.0), PrintValue((fragCoord - vec2(184.0 + 24.0, 5.0)) / vFontSize, mod(iDate.w / 60.0, 60.0), 2.0, 0.0));
    vColour = mix(vColour, vec3(1.0, 0.0, 1.0), PrintValue((fragCoord - vec2(184.0 + 48.0, 5.0)) / vFontSize, mod(iDate.w, 60.0), 2.0, 0.0));

    // Print Shader Time
    vec2 vPixelCoord1 = vec2(96.0, 5.0);
    float fValue1 = iTime;
    fDigits = 6.0;
    float fIsDigit1 = PrintValue((fragCoord - vPixelCoord1) / vFontSize, fValue1, fDigits, fDecimalPlaces);
    vColour = mix(vColour, vec3(0.0, 1.0, 1.0), fIsDigit1);

    if (iMouse.x > 0.0)
    {
        // Print Mouse X
        vec2 vPixelCoord2 = iMouse.xy + vec2(-52.0, 6.0);
        float fValue2 = iMouse.x / iResolution.x;
        fDigits = 1.0;
        fDecimalPlaces = 3.0;
        float fIsDigit2 = PrintValue((fragCoord - vPixelCoord2) / vFontSize, fValue2, fDigits, fDecimalPlaces);
        vColour = mix(vColour, vec3(0.0, 1.0, 0.0), fIsDigit2);

        // Print Mouse Y
        vec2 vPixelCoord3 = iMouse.xy + vec2(0.0, 6.0);
        float fValue3 = iMouse.y / iResolution.y;
        fDigits = 1.0;
        float fIsDigit3 = PrintValue((fragCoord - vPixelCoord3) / vFontSize, fValue3, fDigits, fDecimalPlaces);
        vColour = mix(vColour, vec3(0.0, 1.0, 0.0), fIsDigit3);
    }

    fragColor = vec4(vColour, 1);
}
