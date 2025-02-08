import { MixerHorizontalIcon } from "@radix-ui/react-icons";
import {
  ALargeSmall,
  BookOpenCheck,
  CalendarPlus,
  ChartColumn,
  ChartLine,
  ChartNoAxesGantt,
  Check,
  ChevronUp,
  CircleAlert,
  DiamondPlus,
  Ellipsis,
  FilePenLine,
  Frame,
  GitPullRequestClosed,
  Info,
  LetterText,
  ListFilter,
  ListTodo,
  Loader2,
  LogOut,
  LucideProps,
  Menu,
  Plus,
  ScanEye,
  Signature,
  SquareMousePointer,
  Star,
  Trash2,
  Upload,
  User,
  Users,
  X,
} from "lucide-react";

export const Icons = {
  arrowUp: ChevronUp,
  user: User,
  signOut: LogOut,
  star: Star,
  deleteButton: Trash2,
  addButton: Plus,
  customPropsButton: MixerHorizontalIcon,
  previewButton: ScanEye,
  upload: Upload,
  info: Info,
  todo: ListTodo,
  staff: Users,
  blog: BookOpenCheck,
  stats: ChartColumn,
  frames: Frame,
  addFont: ALargeSmall,
  addFrame: DiamondPlus,
  manage: ChartNoAxesGantt,
  manageFont: LetterText,
  growth: ChartLine,
  rejected: GitPullRequestClosed,
  menu: Menu,
  approve: Signature,
  reject: CircleAlert,
  edit: FilePenLine,
  selected: Check,
  select: SquareMousePointer,
  filter: ListFilter,
  cancel: X,
  pending: Ellipsis,
  soon: CalendarPlus,
  editPen: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      {...props}
    >
      <path d="M200-200h57l391-391-57-57-391 391v57Zm-80 80v-170l528-527q12-11 26.5-17t30.5-6q16 0 31 6t26 18l55 56q12 11 17.5 26t5.5 30q0 16-5.5 30.5T817-647L290-120H120Zm640-584-56-56 56 56Zm-141 85-28-29 57 57-29-28Z" />
    </svg>
  ),
  addIssue: ({ ...props }: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      height="24px"
      viewBox="0 -960 960 960"
      width="24px"
      fill="currentColor"
      {...props}
    >
      <path d="M160-160q-33 0-56.5-23.5T80-240v-480q0-33 23.5-56.5T160-800h640q33 0 56.5 23.5T880-720v240H160v240h400v80H160Zm0-480h640v-80H160v80ZM760-80v-120H640v-80h120v-120h80v120h120v80H840v120h-80ZM160-240v-480 480Z" />
    </svg>
  ),
  spinner: (props: LucideProps) => (
    <Loader2 className="animate-spin" {...props} />
  ),
  icon: (props: LucideProps) => (
    <svg
      width="78.001"
      height="71.201"
      viewBox="0 0 78.001 71.201"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g
        id="svgGroup"
        strokeLinecap="round"
        fillRule="evenodd"
        stroke="#ffffff"
        strokeWidth="0.25mm"
        fill="#ffffff"
        style={{ stroke: "#ffffff", strokeWidth: "0.25mm", fill: "#ffffff" }}
      >
        <path
          d="M10 10 Q 6 10 6 14 Q 6 18 10 18 Q 14 18 14 22 Q 14 26 10 26 Q 6 26 6 30 Q 6 34 10 34"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M20 10 L20 34 M20 22 L30 22 M30 10 L30 34"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M40 10 L40 30 Q 40 34 45 34 Q 50 34 50 30 L50 10"
          vectorEffect="non-scaling-stroke"
        />
        <path
          d="M60 34 L65 10 L70 34 M62 26 L68 26"
          vectorEffect="non-scaling-stroke"
        />
      </g>
    </svg>
  ),
  deselect: (props: LucideProps) => (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={props.size}
      height={props.size}
      viewBox={`0 0 ${props.size} ${props.size}`}
      fill="none"
      stroke="currentColor"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
      className="icon icon-tabler icons-tabler-outline icon-tabler-deselect"
    >
      <path stroke="none" d="M0 0h24v24H0z" fill="none" />
      <path d="M12 8h3a1 1 0 0 1 1 1v3" />
      <path d="M16 16h-7a1 1 0 0 1 -1 -1v-7" />
      <path d="M12 20v.01" />
      <path d="M16 20v.01" />
      <path d="M8 20v.01" />
      <path d="M4 20v.01" />
      <path d="M4 16v.01" />
      <path d="M4 12v.01" />
      <path d="M4 8v.01" />
      <path d="M8 4v.01" />
      <path d="M12 4v.01" />
      <path d="M16 4v.01" />
      <path d="M20 4v.01" />
      <path d="M20 8v.01" />
      <path d="M20 12v.01" />
      <path d="M20 16v.01" />
      <path d="M3 3l18 18" />
    </svg>
  ),
};
