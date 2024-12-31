declare module 'react-icons/hi' {
  import { IconType } from 'react-icons';
  export const HiOutlineHome: IconType;
  export const HiOutlineBriefcase: IconType;
  export const HiOutlinePlus: IconType;
  export const HiOutlinePencil: IconType;
  export const HiOutlineTrash: IconType;
  export const HiOutlineCheck: IconType;
  export const HiOutlineX: IconType;
  export const HiOutlineDocument: IconType;
  export const HiOutlineShoppingCart: IconType;
  export const HiOutlineHeart: IconType;
  export const HiOutlineStar: IconType;
  export const HiOutlineBookmark: IconType;
  export const HiOutlineCalendar: IconType;
  export const HiOutlineGlobe: IconType;
  export const HiOutlineLightBulb: IconType;
}

declare module 'react-icons/io' {
  import { IconType } from 'react-icons';
  export const IoMdArrowDropdown: IconType;
}

declare module 'chrono-node' {
  export function parse(text: string): Array<{
    start: {
      get: (unit: string) => number | undefined;
    };
  }>;
} 