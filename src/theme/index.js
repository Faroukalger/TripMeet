// ============================================================
//  TripMeet — Design System / Theme
// ============================================================

export const Colors = {
  // Gradient principal (rose → orange)
  gradientStart: '#E8327A',
  gradientEnd:   '#F07030',

  // Bleu méditerranéen
  blue:          '#2AABDC',
  blueDark:      '#1A8BB8',
  bluePale:      '#D6F0FA',
  bluePale2:     '#EAF7FD',

  // Accents
  pink:          '#E8327A',
  orange:        '#F07030',

  // Fonds
  sand:          '#FDF9F4',
  white:         '#FFFFFF',
  background:    '#F0F4F8',

  // Texte
  text:          '#0D3547',
  muted:         '#5E9DB8',
  border:        '#B5DCEA',

  // Or hôtelier
  gold:          '#C9A84C',
  goldPale:      '#FFF8E8',

  // Succès
  success:       '#2ECC71',
  successPale:   '#EAFAF1',

  // Divers
  grey:          '#F4F4F4',
  greyText:      '#CCCCCC',
  dark:          '#0D1B2A',
};

export const Fonts = {
  // Nunito — titres, logo, labels forts
  black:        'Nunito-Black',
  extraBold:    'Nunito-ExtraBold',
  bold:         'Nunito-Bold',
  semiBold:     'Nunito-SemiBold',
  regular:      'Nunito-Regular',

  // Nunito Sans — corps de texte
  bodyBold:     'NunitoSans-Bold',
  bodySemiBold: 'NunitoSans-SemiBold',
  body:         'NunitoSans-Regular',
};

export const Spacing = {
  xs:   4,
  sm:   8,
  md:   12,
  lg:   16,
  xl:   24,
  xxl:  32,
};

export const Radius = {
  sm:   8,
  md:   12,
  lg:   16,
  xl:   20,
  xxl:  26,
  full: 999,
};

export const Shadow = {
  card: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  strong: {
    shadowColor: '#E8327A',
    shadowOffset: { width: 0, height: 5 },
    shadowOpacity: 0.28,
    shadowRadius: 14,
    elevation: 8,
  },
};
