export const BG_CELL_SIZE: number = 10;
export const ZOOM_LEVEL_MIN: number = 1;
export const ZOOM_LEVEL_MAX: number = 400;
export const ZOOM_LEVEL_DEFAULT: number = 100;
export const ZOOM_MANUAL_LEVELS: number[] = [1, 2, 3, 5, 10, 15, 20, 33, 50, 75, 100, 125, 150, 200, 250, 300, 400];
export const ZOOM_VISIBLE_LEVELS: number[] = [50, 70, 100, 150, 200];
export const ITEMS_RECTANGLE_PADDING: number = 20;

export enum ItemTypes {
    Start = 'start',
    Finish = 'finish',
    Action1 = 'action1',
    Action2 = 'action2',
}

export enum DraggingTypes {
    Canvas = 'canvas',
    Line = 'line',
}

export enum PortType {
    ActionOutput = 'action-output-port',
    ActionInput = 'action-input-port',
    DataOutput = 'data-output-port',
    DataInput = 'data-input-port',
}

export enum ColorName {
    amber = 'amber',
    blue = 'blue',
    cyan = 'cyan',
    emerald = 'emerald',
    fuchsia = 'fuchsia',
    gray = 'gray',
    green = 'green',
    indigo = 'indigo',
    lime = 'lime',
    neutral = 'neutral',
    orange = 'orange',
    pink = 'pink',
    purple = 'purple',
    red = 'red',
    rose = 'rose',
    sky = 'sky',
    slate = 'slate',
    stone = 'stone',
    teal = 'teal',
    violet = 'violet',
    yellow = 'yellow',
    zinc = 'zinc',
}

export enum ElementTypeColor {
    'start' = ColorName.orange,
    'finish' = ColorName.green,
    'action1' = ColorName.blue,
    'action2' = ColorName.fuchsia,
}

export enum PortTypeColor {
    'action-output-port' = ColorName.orange,
    'action-input-port' = ColorName.green,
    'data-output-port' = ColorName.blue,
    'data-input-port' = ColorName.fuchsia,
}

export enum ColorRGB {
    black = 'rgb(0, 0, 0)',
    white = 'rgb(255, 255, 255)',
    slate_50 = 'rgb(248, 250, 252)',
    slate_100 = 'rgb(241, 245, 249)',
    slate_200 = 'rgb(226, 232, 240)',
    slate_300 = 'rgb(203, 213, 225)',
    slate_400 = 'rgb(148, 163, 184)',
    slate_500 = 'rgb(100, 116, 139)',
    slate_600 = 'rgb(71, 85, 105)',
    slate_700 = 'rgb(51, 65, 85)',
    slate_800 = 'rgb(30, 41, 59)',
    slate_900 = 'rgb(15, 23, 42)',
    slate_950 = 'rgb(2, 6, 23)',
    gray_50 = 'rgb(249, 250, 251)',
    gray_100 = 'rgb(243, 244, 246)',
    gray_200 = 'rgb(229, 231, 235)',
    gray_300 = 'rgb(209, 213, 219)',
    gray_400 = 'rgb(156, 163, 175)',
    gray_500 = 'rgb(107, 114, 128)',
    gray_600 = 'rgb(75, 85, 99)',
    gray_700 = 'rgb(55, 65, 81)',
    gray_800 = 'rgb(31, 41, 55)',
    gray_900 = 'rgb(17, 24, 39)',
    gray_950 = 'rgb(3, 7, 18)',
    zinc_50 = 'rgb(250, 250, 250)',
    zinc_100 = 'rgb(244, 244, 245)',
    zinc_200 = 'rgb(228, 228, 231)',
    zinc_300 = 'rgb(212, 212, 216)',
    zinc_400 = 'rgb(161, 161, 170)',
    zinc_500 = 'rgb(113, 113, 122)',
    zinc_600 = 'rgb(82, 82, 91)',
    zinc_700 = 'rgb(63, 63, 70)',
    zinc_800 = 'rgb(39, 39, 42)',
    zinc_900 = 'rgb(24, 24, 27)',
    zinc_950 = 'rgb(9, 9, 11)',
    neutral_50 = 'rgb(250, 250, 250)',
    neutral_100 = 'rgb(245, 245, 245)',
    neutral_200 = 'rgb(229, 229, 229)',
    neutral_300 = 'rgb(212, 212, 212)',
    neutral_400 = 'rgb(163, 163, 163)',
    neutral_500 = 'rgb(115, 115, 115)',
    neutral_600 = 'rgb(82, 82, 82)',
    neutral_700 = 'rgb(64, 64, 64)',
    neutral_800 = 'rgb(38, 38, 38)',
    neutral_900 = 'rgb(23, 23, 23)',
    neutral_950 = 'rgb(10, 10, 10)',
    stone_50 = 'rgb(250, 250, 249)',
    stone_100 = 'rgb(245, 245, 244)',
    stone_200 = 'rgb(231, 229, 228)',
    stone_300 = 'rgb(214, 211, 209)',
    stone_400 = 'rgb(168, 162, 158)',
    stone_500 = 'rgb(120, 113, 108)',
    stone_600 = 'rgb(87, 83, 78)',
    stone_700 = 'rgb(68, 64, 60)',
    stone_800 = 'rgb(41, 37, 36)',
    stone_900 = 'rgb(28, 25, 23)',
    stone_950 = 'rgb(12, 10, 9)',
    red_50 = 'rgb(254, 242, 242)',
    red_100 = 'rgb(254, 226, 226)',
    red_200 = 'rgb(254, 202, 202)',
    red_300 = 'rgb(252, 165, 165)',
    red_400 = 'rgb(248, 113, 113)',
    red_500 = 'rgb(239, 68, 68)',
    red_600 = 'rgb(220, 38, 38)',
    red_700 = 'rgb(185, 28, 28)',
    red_800 = 'rgb(153, 27, 27)',
    red_900 = 'rgb(127, 29, 29)',
    red_950 = 'rgb(69, 10, 10)',
    orange_50 = 'rgb(255, 247, 237)',
    orange_100 = 'rgb(255, 237, 213)',
    orange_200 = 'rgb(254, 215, 170)',
    orange_300 = 'rgb(253, 186, 116)',
    orange_400 = 'rgb(251, 146, 60)',
    orange_500 = 'rgb(249, 115, 22)',
    orange_600 = 'rgb(234, 88, 12)',
    orange_700 = 'rgb(194, 65, 12)',
    orange_800 = 'rgb(154, 52, 18)',
    orange_900 = 'rgb(124, 45, 18)',
    orange_950 = 'rgb(67, 20, 7)',
    amber_50 = 'rgb(255, 251, 235)',
    amber_100 = 'rgb(254, 243, 199)',
    amber_200 = 'rgb(253, 230, 138)',
    amber_300 = 'rgb(252, 211, 77)',
    amber_400 = 'rgb(251, 191, 36)',
    amber_500 = 'rgb(245, 158, 11)',
    amber_600 = 'rgb(217, 119, 6)',
    amber_700 = 'rgb(180, 83, 9)',
    amber_800 = 'rgb(146, 64, 14)',
    amber_900 = 'rgb(120, 53, 15)',
    amber_950 = 'rgb(69, 26, 3)',
    yellow_50 = 'rgb(254, 252, 232)',
    yellow_100 = 'rgb(254, 249, 195)',
    yellow_200 = 'rgb(254, 240, 138)',
    yellow_300 = 'rgb(253, 224, 71)',
    yellow_400 = 'rgb(250, 204, 21)',
    yellow_500 = 'rgb(234, 179, 8)',
    yellow_600 = 'rgb(202, 138, 4)',
    yellow_700 = 'rgb(161, 98, 7)',
    yellow_800 = 'rgb(133, 77, 14)',
    yellow_900 = 'rgb(113, 63, 18)',
    yellow_950 = 'rgb(66, 32, 6)',
    lime_50 = 'rgb(247, 254, 231)',
    lime_100 = 'rgb(236, 252, 203)',
    lime_200 = 'rgb(217, 249, 157)',
    lime_300 = 'rgb(190, 242, 100)',
    lime_400 = 'rgb(163, 230, 53)',
    lime_500 = 'rgb(132, 204, 22)',
    lime_600 = 'rgb(101, 163, 13)',
    lime_700 = 'rgb(77, 124, 15)',
    lime_800 = 'rgb(63, 98, 18)',
    lime_900 = 'rgb(54, 83, 20)',
    lime_950 = 'rgb(26, 46, 5)',
    green_50 = 'rgb(240, 253, 244)',
    green_100 = 'rgb(220, 252, 231)',
    green_200 = 'rgb(187, 247, 208)',
    green_300 = 'rgb(134, 239, 172)',
    green_400 = 'rgb(74, 222, 128)',
    green_500 = 'rgb(34, 197, 94)',
    green_600 = 'rgb(22, 163, 74)',
    green_700 = 'rgb(21, 128, 61)',
    green_800 = 'rgb(22, 101, 52)',
    green_900 = 'rgb(20, 83, 45)',
    green_950 = 'rgb(5, 46, 22)',
    emerald_50 = 'rgb(236, 253, 245)',
    emerald_100 = 'rgb(209, 250, 229)',
    emerald_200 = 'rgb(167, 243, 208)',
    emerald_300 = 'rgb(110, 231, 183)',
    emerald_400 = 'rgb(52, 211, 153)',
    emerald_500 = 'rgb(16, 185, 129)',
    emerald_600 = 'rgb(5, 150, 105)',
    emerald_700 = 'rgb(4, 120, 87)',
    emerald_800 = 'rgb(6, 95, 70)',
    emerald_900 = 'rgb(6, 78, 59)',
    emerald_950 = 'rgb(2, 44, 34)',
    teal_50 = 'rgb(240, 253, 250)',
    teal_100 = 'rgb(204, 251, 241)',
    teal_200 = 'rgb(153, 246, 228)',
    teal_300 = 'rgb(94, 234, 212)',
    teal_400 = 'rgb(45, 212, 191)',
    teal_500 = 'rgb(20, 184, 166)',
    teal_600 = 'rgb(13, 148, 136)',
    teal_700 = 'rgb(15, 118, 110)',
    teal_800 = 'rgb(17, 94, 89)',
    teal_900 = 'rgb(19, 78, 74)',
    teal_950 = 'rgb(4, 47, 46)',
    cyan_50 = 'rgb(236, 254, 255)',
    cyan_100 = 'rgb(207, 250, 254)',
    cyan_200 = 'rgb(165, 243, 252)',
    cyan_300 = 'rgb(103, 232, 249)',
    cyan_400 = 'rgb(34, 211, 238)',
    cyan_500 = 'rgb(6, 182, 212)',
    cyan_600 = 'rgb(8, 145, 178)',
    cyan_700 = 'rgb(14, 116, 144)',
    cyan_800 = 'rgb(21, 94, 117)',
    cyan_900 = 'rgb(22, 78, 99)',
    cyan_950 = 'rgb(8, 51, 68)',
    sky_50 = 'rgb(240, 249, 255)',
    sky_100 = 'rgb(224, 242, 254)',
    sky_200 = 'rgb(186, 230, 253)',
    sky_300 = 'rgb(125, 211, 252)',
    sky_400 = 'rgb(56, 189, 248)',
    sky_500 = 'rgb(14, 165, 233)',
    sky_600 = 'rgb(2, 132, 199)',
    sky_700 = 'rgb(3, 105, 161)',
    sky_800 = 'rgb(7, 89, 133)',
    sky_900 = 'rgb(12, 74, 110)',
    sky_950 = 'rgb(8, 47, 73)',
    blue_50 = 'rgb(239, 246, 255)',
    blue_100 = 'rgb(219, 234, 254)',
    blue_200 = 'rgb(191, 219, 254)',
    blue_300 = 'rgb(147, 197, 253)',
    blue_400 = 'rgb(96, 165, 250)',
    blue_500 = 'rgb(59, 130, 246)',
    blue_600 = 'rgb(37, 99, 235)',
    blue_700 = 'rgb(29, 78, 216)',
    blue_800 = 'rgb(30, 64, 175)',
    blue_900 = 'rgb(30, 58, 138)',
    blue_950 = 'rgb(23, 37, 84)',
    indigo_50 = 'rgb(238, 242, 255)',
    indigo_100 = 'rgb(224, 231, 255)',
    indigo_200 = 'rgb(199, 210, 254)',
    indigo_300 = 'rgb(165, 180, 252)',
    indigo_400 = 'rgb(129, 140, 248)',
    indigo_500 = 'rgb(99, 102, 241)',
    indigo_600 = 'rgb(79, 70, 229)',
    indigo_700 = 'rgb(67, 56, 202)',
    indigo_800 = 'rgb(55, 48, 163)',
    indigo_900 = 'rgb(49, 46, 129)',
    indigo_950 = 'rgb(30, 27, 75)',
    violet_50 = 'rgb(245, 243, 255)',
    violet_100 = 'rgb(237, 233, 254)',
    violet_200 = 'rgb(221, 214, 254)',
    violet_300 = 'rgb(196, 181, 253)',
    violet_400 = 'rgb(167, 139, 250)',
    violet_500 = 'rgb(139, 92, 246)',
    violet_600 = 'rgb(124, 58, 237)',
    violet_700 = 'rgb(109, 40, 217)',
    violet_800 = 'rgb(91, 33, 182)',
    violet_900 = 'rgb(76, 29, 149)',
    violet_950 = 'rgb(46, 16, 101)',
    purple_50 = 'rgb(250, 245, 255)',
    purple_100 = 'rgb(243, 232, 255)',
    purple_200 = 'rgb(233, 213, 255)',
    purple_300 = 'rgb(216, 180, 254)',
    purple_400 = 'rgb(192, 132, 252)',
    purple_500 = 'rgb(168, 85, 247)',
    purple_600 = 'rgb(147, 51, 234)',
    purple_700 = 'rgb(126, 34, 206)',
    purple_800 = 'rgb(107, 33, 168)',
    purple_900 = 'rgb(88, 28, 135)',
    purple_950 = 'rgb(59, 7, 100)',
    fuchsia_50 = 'rgb(253, 244, 255)',
    fuchsia_100 = 'rgb(250, 232, 255)',
    fuchsia_200 = 'rgb(245, 208, 254)',
    fuchsia_300 = 'rgb(240, 171, 252)',
    fuchsia_400 = 'rgb(232, 121, 249)',
    fuchsia_500 = 'rgb(217, 70, 239)',
    fuchsia_600 = 'rgb(192, 38, 211)',
    fuchsia_700 = 'rgb(162, 28, 175)',
    fuchsia_800 = 'rgb(134, 25, 143)',
    fuchsia_900 = 'rgb(112, 26, 117)',
    fuchsia_950 = 'rgb(74, 4, 78)',
    pink_50 = 'rgb(253, 242, 248)',
    pink_100 = 'rgb(252, 231, 243)',
    pink_200 = 'rgb(251, 207, 232)',
    pink_300 = 'rgb(249, 168, 212)',
    pink_400 = 'rgb(244, 114, 182)',
    pink_500 = 'rgb(236, 72, 153)',
    pink_600 = 'rgb(219, 39, 119)',
    pink_700 = 'rgb(190, 24, 93)',
    pink_800 = 'rgb(157, 23, 77)',
    pink_900 = 'rgb(131, 24, 67)',
    pink_950 = 'rgb(80, 7, 36)',
    rose_50 = 'rgb(255, 241, 242)',
    rose_100 = 'rgb(255, 228, 230)',
    rose_200 = 'rgb(254, 205, 211)',
    rose_300 = 'rgb(253, 164, 175)',
    rose_400 = 'rgb(251, 113, 133)',
    rose_500 = 'rgb(244, 63, 94)',
    rose_600 = 'rgb(225, 29, 72)',
    rose_700 = 'rgb(190, 18, 60)',
    rose_800 = 'rgb(159, 18, 57)',
    rose_900 = 'rgb(136, 19, 55)',
    rose_950 = 'rgb(76, 5, 25)',
}

export enum ColorHEX {
    black = '#000000',
    white = '#FFFFFF',
    slate_50 = '#F8FAFC',
    slate_100 = '#F1F5F9',
    slate_200 = '#E2E8F0',
    slate_300 = '#CBD5E1',
    slate_400 = '#94A3B8',
    slate_500 = '#64748B',
    slate_600 = '#475569',
    slate_700 = '#334155',
    slate_800 = '#1E293B',
    slate_900 = '#0F172A',
    slate_950 = '#020617',
    gray_50 = '#F9FAFB',
    gray_100 = '#F3F4F6',
    gray_200 = '#E5E7EB',
    gray_300 = '#D1D5DB',
    gray_400 = '#9CA3AF',
    gray_500 = '#6B7280',
    gray_600 = '#4B5563',
    gray_700 = '#374151',
    gray_800 = '#1F2937',
    gray_900 = '#111827',
    gray_950 = '#030712',
    zinc_50 = '#FAFAFA',
    zinc_100 = '#F4F4F5',
    zinc_200 = '#E4E4E7',
    zinc_300 = '#D4D4D8',
    zinc_400 = '#A1A1AA',
    zinc_500 = '#71717A',
    zinc_600 = '#52525B',
    zinc_700 = '#3F3F46',
    zinc_800 = '#27272A',
    zinc_900 = '#18181B',
    zinc_950 = '#09090B',
    neutral_50 = '#FAFAFA',
    neutral_100 = '#F5F5F5',
    neutral_200 = '#E5E5E5',
    neutral_300 = '#D4D4D4',
    neutral_400 = '#A3A3A3',
    neutral_500 = '#737373',
    neutral_600 = '#525252',
    neutral_700 = '#404040',
    neutral_800 = '#262626',
    neutral_900 = '#171717',
    neutral_950 = '#0A0A0A',
    stone_50 = '#FAFAF9',
    stone_100 = '#F5F5F4',
    stone_200 = '#E7E5E4',
    stone_300 = '#D6D3D1',
    stone_400 = '#A8A29E',
    stone_500 = '#78716C',
    stone_600 = '#57534E',
    stone_700 = '#44403C',
    stone_800 = '#292524',
    stone_900 = '#1C1917',
    stone_950 = '#0C0A09',
    red_50 = '#FEF2F2',
    red_100 = '#FEE2E2',
    red_200 = '#FECACA',
    red_300 = '#FCA5A5',
    red_400 = '#F87171',
    red_500 = '#EF4444',
    red_600 = '#DC2626',
    red_700 = '#B91C1C',
    red_800 = '#991B1B',
    red_900 = '#7F1D1D',
    red_950 = '#450A0A',
    orange_50 = '#FFF7ED',
    orange_100 = '#FFEDD5',
    orange_200 = '#FEF0AA',
    orange_300 = '#FDBA74',
    orange_400 = '#FB923C',
    orange_500 = '#F97316',
    orange_600 = '#EA580C',
    orange_700 = '#C2410C',
    orange_800 = '#9A3412',
    orange_900 = '#7C2D12',
    orange_950 = '#431407',
    amber_50 = '#FFFBEB',
    amber_100 = '#FEF3C7',
    amber_200 = '#FDE68A',
    amber_300 = '#FCD34D',
    amber_400 = '#FBbF24',
    amber_500 = '#F59E0B',
    amber_600 = '#D97706',
    amber_700 = '#B45309',
    amber_800 = '#92400E',
    amber_900 = '#78350F',
    amber_950 = '#451A03',
    yellow_50 = '#FEFCE8',
    yellow_100 = '#FEF9C3',
    yellow_200 = '#FEF08A',
    yellow_300 = '#FDE047',
    yellow_400 = '#FACC15',
    yellow_500 = '#EAB308',
    yellow_600 = '#CA8A04',
    yellow_700 = '#A16207',
    yellow_800 = '#854D0E',
    yellow_900 = '#713F12',
    yellow_950 = '#422006',
    lime_50 = '#F7FEE7',
    lime_100 = '#ECFCCB',
    lime_200 = '#D9F99D',
    lime_300 = '#BEF264',
    lime_400 = '#A3E635',
    lime_500 = '#84CC16',
    lime_600 = '#65A30D',
    lime_700 = '#4D7C0F',
    lime_800 = '#3F6212',
    lime_900 = '#365314',
    lime_950 = '#1A2E05',
    green_50 = '#F0FDF4',
    green_100 = '#DCFDE5',
    green_200 = '#BBF7D0',
    green_300 = '#86EFAC',
    green_400 = '#4ADE80',
    green_500 = '#22C55E',
    green_600 = '#16A34A',
    green_700 = '#15803D',
    green_800 = '#166534',
    green_900 = '#14532D',
    green_950 = '#052E16',
    emerald_50 = '#ECFDF5',
    emerald_100 = '#D1FAE5',
    emerald_200 = '#A7F3D0',
    emerald_300 = '#6EE7B7',
    emerald_400 = '#34D399',
    emerald_500 = '#10B981',
    emerald_600 = '#059669',
    emerald_700 = '#047857',
    emerald_800 = '#065F46',
    emerald_900 = '#064E3B',
    emerald_950 = '#022C22',
    teal_50 = '#F0FDFA',
    teal_100 = '#CCFBF1',
    teal_200 = '#99F6E4',
    teal_300 = '#5EEAD4',
    teal_400 = '#2DD4BF',
    teal_500 = '#14B8A6',
    teal_600 = '#0D9488',
    teal_700 = '#0F7670',
    teal_800 = '#115E59',
    teal_900 = '#134E4A',
    teal_950 = '#042F2E',
    cyan_50 = '#ECFEFF',
    cyan_100 = '#CFFAFE',
    cyan_200 = '#A5F3FC',
    cyan_300 = '#67E8F9',
    cyan_400 = '#22D3EE',
    cyan_500 = '#06B6D4',
    cyan_600 = '#0891B2',
    cyan_700 = '#0E7490',
    cyan_800 = '#155E75',
    cyan_900 = '#164E63',
    cyan_950 = '#083344',
    sky_50 = '#F0F9FF',
    sky_100 = '#E0F2FE',
    sky_200 = '#BAE6FD',
    sky_300 = '#7DD3FC',
    sky_400 = '#38BDF8',
    sky_500 = '#0EA5E9',
    sky_600 = '#0284C7',
    sky_700 = '#0369A1',
    sky_800 = '#075985',
    sky_900 = '#0C4A6E',
    sky_950 = '#082F49',
    blue_50 = '#EFF6FF',
    blue_100 = '#DBEAFE',
    blue_200 = '#BFDBFE',
    blue_300 = '#93C5FD',
    blue_400 = '#60A5FA',
    blue_500 = '#3B82F6',
    blue_600 = '#2563EB',
    blue_700 = '#1D4ED8',
    blue_800 = '#1E40AF',
    blue_900 = '#1E3A8A',
    blue_950 = '#172554',
    indigo_50 = '#EEF2FF',
    indigo_100 = '#E0E7FF',
    indigo_200 = '#C7D2FE',
    indigo_300 = '#A5B4FC',
    indigo_400 = '#818CF8',
    indigo_500 = '#6366F1',
    indigo_600 = '#4F46E5',
    indigo_700 = '#4338CA',
    indigo_800 = '#3730A3',
    indigo_900 = '#312E81',
    indigo_950 = '#1E1B4B',
    violet_50 = '#F5F3FF',
    violet_100 = '#EDE9FE',
    violet_200 = '#DDD6FE',
    violet_300 = '#C4B5FD',
    violet_400 = '#A78BFA',
    violet_500 = '#8B5CF6',
    violet_600 = '#7C3AED',
    violet_700 = '#6D28D9',
    violet_800 = '#5B21B6',
    violet_900 = '#4C1D95',
    violet_950 = '#2E1065',
    purple_50 = '#FAF5FF',
    purple_100 = '#F3E8FF',
    purple_200 = '#E9D5FF',
    purple_300 = '#D8B4FE',
    purple_400 = '#C084FC',
    purple_500 = '#A855F7',
    purple_600 = '#9333EA',
    purple_700 = '#7E22CE',
    purple_800 = '#6B21A8',
    purple_900 = '#581C87',
    purple_950 = '#3B0764',
    fuchsia_50 = '#FDF4FF',
    fuchsia_100 = '#FAE8FF',
    fuchsia_200 = '#F5D0FE',
    fuchsia_300 = '#F0ABFC',
    fuchsia_400 = '#E879F9',
    fuchsia_500 = '#D946EF',
    fuchsia_600 = '#C026D3',
    fuchsia_700 = '#A21CAF',
    fuchsia_800 = '#86198F',
    fuchsia_900 = '#701A75',
    fuchsia_950 = '#4A044E',
    pink_50 = '#FDF2F8',
    pink_100 = '#FCE7F3',
    pink_200 = '#FBCFE8',
    pink_300 = '#F9A8D4',
    pink_400 = '#F472B6',
    pink_500 = '#EC4899',
    pink_600 = '#DB2777',
    pink_700 = '#BE185D',
    pink_800 = '#9D174D',
    pink_900 = '#831843',
    pink_950 = '#500724',
    rose_50 = '#FFF1F2',
    rose_100 = '#FFE4E6',
    rose_200 = '#FECDD3',
    rose_300 = '#FDA4AF',
    rose_400 = '#FB7185',
    rose_500 = '#F43F5E',
    rose_600 = '#E11D48',
    rose_700 = '#BE123C',
    rose_800 = '#9F1239',
    rose_900 = '#881337',
    rose_950 = '#4C0519'
}

export const TailwindColorHEX = {
    inherit: 'inherit',
    current: 'currentColor',
    transparent: 'transparent',
    black: '#000',
    white: '#fff',
    slate: {
        '50': '#f8fafc',
        '100': '#f1f5f9',
        '200': '#e2e8f0',
        '300': '#cbd5e1',
        '400': '#94a3b8',
        '500': '#64748b',
        '600': '#475569',
        '700': '#334155',
        '800': '#1e293b',
        '900': '#0f172a',
        '950': '#020617',
    },
    gray: {
        '50': '#f9fafb',
        '100': '#f3f4f6',
        '200': '#e5e7eb',
        '300': '#d1d5db',
        '400': '#9ca3af',
        '500': '#6b7280',
        '600': '#4b5563',
        '700': '#374151',
        '800': '#1f2937',
        '900': '#111827',
        '950': '#030712',
    },
    zinc: {
        '50': '#fafafa',
        '100': '#f4f4f5',
        '200': '#e4e4e7',
        '300': '#d4d4d8',
        '400': '#a1a1aa',
        '500': '#71717a',
        '600': '#52525b',
        '700': '#3f3f46',
        '800': '#27272a',
        '900': '#18181b',
        '950': '#09090b',
    },
    neutral: {
        '50': '#fafafa',
        '100': '#f5f5f5',
        '200': '#e5e5e5',
        '300': '#d4d4d4',
        '400': '#a3a3a3',
        '500': '#737373',
        '600': '#525252',
        '700': '#404040',
        '800': '#262626',
        '900': '#171717',
        '950': '#0a0a0a',
    },
    stone: {
        '50': '#fafaf9',
        '100': '#f5f5f4',
        '200': '#e7e5e4',
        '300': '#d6d3d1',
        '400': '#a8a29e',
        '500': '#78716c',
        '600': '#57534e',
        '700': '#44403c',
        '800': '#292524',
        '900': '#1c1917',
        '950': '#0c0a09',
    },
    red: {
        '50': '#fef2f2',
        '100': '#fee2e2',
        '200': '#fecaca',
        '300': '#fca5a5',
        '400': '#f87171',
        '500': '#ef4444',
        '600': '#dc2626',
        '700': '#b91c1c',
        '800': '#991b1b',
        '900': '#7f1d1d',
        '950': '#450a0a',
    },
    orange: {
        '50': '#fff7ed',
        '100': '#ffedd5',
        '200': '#fed7aa',
        '300': '#fdba74',
        '400': '#fb923c',
        '500': '#f97316',
        '600': '#ea580c',
        '700': '#c2410c',
        '800': '#9a3412',
        '900': '#7c2d12',
        '950': '#431407',
    },
    amber: {
        '50': '#fffbeb',
        '100': '#fef3c7',
        '200': '#fde68a',
        '300': '#fcd34d',
        '400': '#fbbf24',
        '500': '#f59e0b',
        '600': '#d97706',
        '700': '#b45309',
        '800': '#92400e',
        '900': '#78350f',
        '950': '#451a03',
    },
    yellow: {
        '50': '#fefce8',
        '100': '#fef9c3',
        '200': '#fef08a',
        '300': '#fde047',
        '400': '#facc15',
        '500': '#eab308',
        '600': '#ca8a04',
        '700': '#a16207',
        '800': '#854d0e',
        '900': '#713f12',
        '950': '#422006',
    },
    lime: {
        '50': '#f7fee7',
        '100': '#ecfccb',
        '200': '#d9f99d',
        '300': '#bef264',
        '400': '#a3e635',
        '500': '#84cc16',
        '600': '#65a30d',
        '700': '#4d7c0f',
        '800': '#3f6212',
        '900': '#365314',
        '950': '#1a2e05',
    },
    green: {
        '50': '#f0fdf4',
        '100': '#dcfce7',
        '200': '#bbf7d0',
        '300': '#86efac',
        '400': '#4ade80',
        '500': '#22c55e',
        '600': '#16a34a',
        '700': '#15803d',
        '800': '#166534',
        '900': '#14532d',
        '950': '#052e16',
    },
    emerald: {
        '50': '#ecfdf5',
        '100': '#d1fae5',
        '200': '#a7f3d0',
        '300': '#6ee7b7',
        '400': '#34d399',
        '500': '#10b981',
        '600': '#059669',
        '700': '#047857',
        '800': '#065f46',
        '900': '#064e3b',
        '950': '#022c22',
    },
    teal: {
        '50': '#f0fdfa',
        '100': '#ccfbf1',
        '200': '#99f6e4',
        '300': '#5eead4',
        '400': '#2dd4bf',
        '500': '#14b8a6',
        '600': '#0d9488',
        '700': '#0f766e',
        '800': '#115e59',
        '900': '#134e4a',
        '950': '#042f2e',
    },
    cyan: {
        '50': '#ecfeff',
        '100': '#cffafe',
        '200': '#a5f3fc',
        '300': '#67e8f9',
        '400': '#22d3ee',
        '500': '#06b6d4',
        '600': '#0891b2',
        '700': '#0e7490',
        '800': '#155e75',
        '900': '#164e63',
        '950': '#083344',
    },
    sky: {
        '50': '#f0f9ff',
        '100': '#e0f2fe',
        '200': '#bae6fd',
        '300': '#7dd3fc',
        '400': '#38bdf8',
        '500': '#0ea5e9',
        '600': '#0284c7',
        '700': '#0369a1',
        '800': '#075985',
        '900': '#0c4a6e',
        '950': '#082f49',
    },
    blue: {
        '50': '#eff6ff',
        '100': '#dbeafe',
        '200': '#bfdbfe',
        '300': '#93c5fd',
        '400': '#60a5fa',
        '500': '#3b82f6',
        '600': '#2563eb',
        '700': '#1d4ed8',
        '800': '#1e40af',
        '900': '#1e3a8a',
        '950': '#172554',
    },
    indigo: {
        '50': '#eef2ff',
        '100': '#e0e7ff',
        '200': '#c7d2fe',
        '300': '#a5b4fc',
        '400': '#818cf8',
        '500': '#6366f1',
        '600': '#4f46e5',
        '700': '#4338ca',
        '800': '#3730a3',
        '900': '#312e81',
        '950': '#1e1b4b',
    },
    violet: {
        '50': '#f5f3ff',
        '100': '#ede9fe',
        '200': '#ddd6fe',
        '300': '#c4b5fd',
        '400': '#a78bfa',
        '500': '#8b5cf6',
        '600': '#7c3aed',
        '700': '#6d28d9',
        '800': '#5b21b6',
        '900': '#4c1d95',
        '950': '#2e1065',
    },
    purple: {
        '50': '#faf5ff',
        '100': '#f3e8ff',
        '200': '#e9d5ff',
        '300': '#d8b4fe',
        '400': '#c084fc',
        '500': '#a855f7',
        '600': '#9333ea',
        '700': '#7e22ce',
        '800': '#6b21a8',
        '900': '#581c87',
        '950': '#3b0764',
    },
    fuchsia: {
        '50': '#fdf4ff',
        '100': '#fae8ff',
        '200': '#f5d0fe',
        '300': '#f0abfc',
        '400': '#e879f9',
        '500': '#d946ef',
        '600': '#c026d3',
        '700': '#a21caf',
        '800': '#86198f',
        '900': '#701a75',
        '950': '#4a044e',
    },
    pink: {
        '50': '#fdf2f8',
        '100': '#fce7f3',
        '200': '#fbcfe8',
        '300': '#f9a8d4',
        '400': '#f472b6',
        '500': '#ec4899',
        '600': '#db2777',
        '700': '#be185d',
        '800': '#9d174d',
        '900': '#831843',
        '950': '#500724',
    },
    rose: {
        '50': '#fff1f2',
        '100': '#ffe4e6',
        '200': '#fecdd3',
        '300': '#fda4af',
        '400': '#fb7185',
        '500': '#f43f5e',
        '600': '#e11d48',
        '700': '#be123c',
        '800': '#9f1239',
        '900': '#881337',
        '950': '#4c0519',
    },
};
