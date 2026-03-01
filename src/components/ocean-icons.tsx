import type { FC } from 'react'

// 图标通用 Props 类型
interface IconProps {
  size?: number
  color?: string
  className?: string
  opacity?: number
}

// ============================================
// 功能类图标
// ============================================

/**
 * 拼图块图标 - 48×48px
 */
export const PuzzleIcon: FC<IconProps> = ({ size = 48, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <path
      d="M8 8H20V16H28V8H40V20H32V28H40V40H28V32H20V40H8V28H16V20H8V8Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="24" cy="24" r="4" fill="white" opacity={0.3} />
  </svg>
)

/**
 * 奖杯图标 - 48×48px
 */
export const TrophyIcon: FC<IconProps> = ({ size = 48, color = '#FFD700', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <path
      d="M12 8H36V20C36 25.5222 31.5228 30 26 30H22C16.4772 30 12 25.5222 12 20V8Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36 14H42C43.1046 14 44 14.8954 44 16V20C44 22.2091 42.2091 24 40 24H36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 14H6C4.89543 14 4 14.8954 4 16V20C4 22.2091 5.79086 24 8 24H12"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M16 30V36H32V30"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M12 40H36"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="20" r="4" fill="white" opacity={0.4} />
  </svg>
)

/**
 * 灯泡图标（提示）- 32×32px
 */
export const LightbulbIcon: FC<IconProps> = ({ size = 32, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <path
      d="M16 4C11.5817 4 8 7.58172 8 12C8 14.8 9.5 17.3 11.8 18.8L12 20C12 21.1046 12.8954 22 14 22H18C19.1046 22 20 21.1046 20 20L20.2 18.8C22.5 17.3 24 14.8 24 12C24 7.58172 20.4183 4 16 4Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path d="M14 24H18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <path d="M14 27H18" stroke={color} strokeWidth="2" strokeLinecap="round" />
    <circle cx="16" cy="12" r="3" fill="white" opacity={0.5} />
  </svg>
)

/**
 * 眼睛图标（原图）- 32×32px
 */
export const EyeIcon: FC<IconProps> = ({ size = 32, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <path
      d="M4 16C4 16 8 6 16 6C24 6 28 16 28 16C28 16 24 26 16 26C8 26 4 16 4 16Z"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      fill="rgba(0, 122, 255, 0.1)"
    />
    <circle cx="16" cy="16" r="5" fill={color} />
    <circle cx="16" cy="16" r="2" fill="white" />
  </svg>
)

/**
 * 雪花图标（冻结）- 32×32px
 */
export const SnowflakeIcon: FC<IconProps> = ({ size = 32, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <path
      d="M16 4V28"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.5 8.5L25.5 23.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6.5 23.5L25.5 8.5"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="16" cy="16" r="3" fill={color} opacity={0.6} />
  </svg>
)

/**
 * 齿轮图标（设置）- 48×48px
 */
export const SettingsIcon: FC<IconProps> = ({ size = 48, color = '#333333', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <circle cx="24" cy="24" r="6" fill={color} />
    <path
      d="M24 4V10"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M24 38V44"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M4 24H10"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M38 24H44"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M9.858 9.858L14.172 14.172"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M33.828 33.828L38.142 38.142"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M9.858 38.142L14.172 33.828"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
    <path
      d="M33.828 14.172L38.142 9.858"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * 喇叭图标（音效）- 48×48px
 */
export const SpeakerIcon: FC<IconProps> = ({ size = 48, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <path
      d="M8 18V30H18L30 40V8L18 18H8Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M36 18C38.2091 20.2091 38.2091 27.7909 36 30"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M40 14C44.4183 18.4183 44.4183 29.5817 40 34"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * 铃铛图标（震动）- 48×48px
 */
export const BellIcon: FC<IconProps> = ({ size = 48, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <path
      d="M24 6C20.6863 6 18 8.68629 18 12V20H10C8.89543 20 8 20.8954 8 22V32C8 33.1046 8.89543 34 10 34H38C39.1046 34 40 33.1046 40 32V22C40 20.8954 39.1046 20 38 20H30V12C30 8.68629 27.3137 6 24 6Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M18 34V36C18 38.2091 19.7909 40 22 40H26C28.2091 40 30 38.2091 30 36V34"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="24" r="4" fill="white" opacity={0.3} />
  </svg>
)

/**
 * 锁图标（未解锁）- 48×48px
 */
export const LockIcon: FC<IconProps> = ({ size = 48, color = '#E5E5EA', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <rect
      x="10"
      y="22"
      width="28"
      height="20"
      rx="4"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 22V14C16 9.58172 19.5817 6 24 6C28.4183 6 32 9.58172 32 14V22"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <circle cx="24" cy="32" r="3" fill="rgba(0, 0, 0, 0.2)" />
  </svg>
)

// ============================================
// 装饰类图标
// ============================================

/**
 * 小鱼图标 - 32×32px
 */
export const FishIcon: FC<IconProps> = ({ size = 32, color = '#FF9500', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <path
      d="M28 16C28 10.4772 23.5228 6 18 6H10L4 16L10 26H18C23.5228 26 28 21.5228 28 16Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <circle cx="14" cy="14" r="2" fill="white" />
    <circle cx="14" cy="14" r="1" fill="black" />
  </svg>
)

/**
 * 贝壳图标 - 32×32px
 */
export const ShellIcon: FC<IconProps> = ({ size = 32, color = '#FFB6C1', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <path
      d="M16 4C9.37258 4 4 9.37258 4 16C4 22.6274 9.37258 28 16 28C22.6274 28 28 22.6274 28 16C28 9.37258 22.6274 4 16 4Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
    />
    <path
      d="M16 8C12 8 8 12 8 16"
      stroke="rgba(0, 0, 0, 0.2)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
    <path
      d="M16 12C14 12 12 14 12 16"
      stroke="rgba(0, 0, 0, 0.2)"
      strokeWidth="1.5"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * 螃蟹图标 - 32×32px
 */
export const CrabIcon: FC<IconProps> = ({ size = 32, color = '#FF9500', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 32 32"
    fill="none"
    className={className}
  >
    <ellipse
      cx="16"
      cy="20"
      rx="10"
      ry="6"
      fill={color}
      stroke="currentColor"
      strokeWidth="2"
    />
    <circle cx="12" cy="18" r="2" fill="white" />
    <circle cx="20" cy="18" r="2" fill="white" />
    <path
      d="M6 20L2 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M6 20L2 24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M26 20L30 16"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M26 20L30 24"
      stroke={color}
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
)

/**
 * 气泡图标 - 24×24px
 */
export const BubbleIcon: FC<IconProps> = ({ size = 24, color = '#FFB6C1', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <circle cx="12" cy="12" r="8" fill={color} opacity={0.6} />
    <circle cx="6" cy="6" r="3" fill={color} opacity={0.4} />
    <circle cx="18" cy="18" r="2" fill={color} opacity={0.3} />
  </svg>
)

/**
 * 闪光图标 - 24×24px
 */
export const SparkleIcon: FC<IconProps> = ({ size = 24, color = '#FFD700', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    className={className}
  >
    <path
      d="M12 2L13.5 10.5L22 12L13.5 13.5L12 22L10.5 13.5L2 12L10.5 10.5L12 2Z"
      fill={color}
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * 返回箭头图标 - 48×48px
 */
export const BackIcon: FC<IconProps> = ({ size = 48, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <path
      d="M16 24L38 24"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 24L16 18"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10 24L16 30"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * 关闭X图标 - 48×48px
 */
export const CloseIcon: FC<IconProps> = ({ size = 48, color = '#007AFF', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <path
      d="M14 34L34 14"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M34 34L14 14"
      stroke={color}
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

/**
 * 三点菜单图标 - 48×48px
 */
export const MenuIcon: FC<IconProps> = ({ size = 48, color = '#E5E5EA', className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 48 48"
    fill="none"
    className={className}
  >
    <circle cx="24" cy="12" r="4" fill={color} />
    <circle cx="24" cy="24" r="4" fill={color} />
    <circle cx="24" cy="36" r="4" fill={color} />
  </svg>
)
