export function useColourContrast(colour: MaybeRefOrGetter<string>) {
  const redMultiplier = 0.2126
  const greenMultiplier = 0.7152
  const blueMultiplier = 0.0722
  const gamma = 2.4

  const colorLuminance = (value: number) => {
    value /= 255
    if (value <= 0.03928) {
      return value / 12.92
    }
    return ((value + 0.055) / 1.055) ** gamma
  }

  const relativeLuminance = (red: number, green: number, blue: number) => {
    return colorLuminance(red) * redMultiplier
      + colorLuminance(green) * greenMultiplier
      + colorLuminance(blue) * blueMultiplier
  }

  const contrastingColour = computed((): 'black' | 'white' => {
    const colourHash = toValue(colour).replace('#', '')
    if (colourHash.length != 6) {
      return 'white'
    }

    const red = Number.parseInt(colourHash.substring(0, 2), 16)
    const green = Number.parseInt(colourHash.substring(2, 4), 16)
    const blue = Number.parseInt(colourHash.substring(4, 6), 16)

    if (relativeLuminance(red, green, blue) < 0.4) {
      return 'white'
    }
    return 'black'
  })

  return contrastingColour
}

/*
relative luminance

the relative brightness of any point in a colorspace, normalized to 0 for darkest black and 1 for lightest white
  Note 1: For the sRGB colorspace, the relative luminance of a color is defined as
    Luminance = Red * 0.2126 + Green * 0.7152 + Blue * 0.0722
    where Red, Green and Blue are defined as:
      if RsRGB <= 0.03928 then Red = RsRGB/12.92 else Red = ((RsRGB+0.055)/1.055) ^ 2.4
      if GsRGB <= 0.03928 then Green = GsRGB/12.92 else Green = ((GsRGB+0.055)/1.055) ^ 2.4
      if BsRGB <= 0.03928 then Blue = BsRGB/12.92 else Blue = ((BsRGB+0.055)/1.055) ^ 2.4

    and RsRGB, GsRGB, and BsRGB are defined as:
      RsRGB = R8bit/255
      GsRGB = G8bit/255
      BsRGB = B8bit/255

    The "^" character is the exponentiation operator. (Formula taken from [sRGB] and [IEC-4WD]).

  Note 2: Almost all systems used today to view Web content assume sRGB encoding.
    Unless it is known that another color space will be used to process and display the content,
    authors should evaluate using sRGB colorspace.

using 0.4 threshold because it seems to fit the colours better than the 0.5 threshold
*/
