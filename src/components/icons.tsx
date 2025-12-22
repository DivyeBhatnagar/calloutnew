import {
  Trophy,
  Users,
  Shield,
  ClipboardList,
  User,
  Mail,
  Phone,
  Calendar,
  MapPin,
  Target,
  Award,
  Star,
  CheckCircle,
  XCircle,
  AlertCircle,
  Info,
  Settings,
  BarChart3,
  TrendingUp,
  Download,
  Upload,
  RefreshCw,
  Plus,
  Edit,
  Trash2,
  Eye,
  Lock,
  Unlock,
  Home,
  Menu,
  X,
  ChevronRight,
  ChevronLeft,
  Search,
  Filter,
  Play,
  Pause,
  Clock,
  Timer,
  Bell,
  MessageCircle,
  Send,
  Share2,
  Copy,
  HelpCircle,
  FileText,
  Folder,
  Image,
  Video,
  Monitor,
  Server,
  Database,
  Cloud,
  Wifi as Network,
  Link,
  Gamepad2
} from 'lucide-react';

import Icon3D from './Icon3D';

// Gaming & Esports Icons
export const TrophyIcon = (props: any) => <Icon3D icon={Trophy} {...props} />;
export const GameControllerIcon = (props: any) => <Icon3D icon={Gamepad2} {...props} />;
export const GamepadIcon = (props: any) => <Icon3D icon={Gamepad2} {...props} />;
export const AwardIcon = (props: any) => <Icon3D icon={Award} {...props} />;
export const StarIcon = (props: any) => <Icon3D icon={Star} {...props} />;
export const TargetIcon = (props: any) => <Icon3D icon={Target} {...props} />;

// User & Auth Icons
export const UserIcon = (props: any) => <Icon3D icon={User} {...props} />;
export const UsersIcon = (props: any) => <Icon3D icon={Users} {...props} />;
export const ShieldIcon = (props: any) => <Icon3D icon={Shield} {...props} />;
export const LockIcon = (props: any) => <Icon3D icon={Lock} {...props} />;
export const UnlockIcon = (props: any) => <Icon3D icon={Unlock} {...props} />;

// Form & Input Icons
export const ClipboardIcon = (props: any) => <Icon3D icon={ClipboardList} {...props} />;
export const MailIcon = (props: any) => <Icon3D icon={Mail} {...props} />;
export const PhoneIcon = (props: any) => <Icon3D icon={Phone} {...props} />;
export const EditIcon = (props: any) => <Icon3D icon={Edit} {...props} />;

// Status Icons
export const CheckIcon = (props: any) => <Icon3D icon={CheckCircle} {...props} />;
export const XIcon = (props: any) => <Icon3D icon={XCircle} {...props} />;
export const AlertIcon = (props: any) => <Icon3D icon={AlertCircle} {...props} />;
export const InfoIcon = (props: any) => <Icon3D icon={Info} {...props} />;

// Navigation Icons
export const HomeIcon = (props: any) => <Icon3D icon={Home} {...props} />;
export const MenuIcon = (props: any) => <Icon3D icon={Menu} {...props} />;
export const CloseIcon = (props: any) => <Icon3D icon={X} {...props} />;
export const ChevronRightIcon = (props: any) => <Icon3D icon={ChevronRight} {...props} />;
export const ChevronLeftIcon = (props: any) => <Icon3D icon={ChevronLeft} {...props} />;

// Analytics & Dashboard Icons
export const BarChartIcon = (props: any) => <Icon3D icon={BarChart3} {...props} />;
export const TrendingIcon = (props: any) => <Icon3D icon={TrendingUp} {...props} />;
export const SettingsIcon = (props: any) => <Icon3D icon={Settings} {...props} />;

// Action Icons
export const DownloadIcon = (props: any) => <Icon3D icon={Download} {...props} />;
export const UploadIcon = (props: any) => <Icon3D icon={Upload} {...props} />;
export const RefreshIcon = (props: any) => <Icon3D icon={RefreshCw} {...props} />;
export const PlusIcon = (props: any) => <Icon3D icon={Plus} {...props} />;
export const TrashIcon = (props: any) => <Icon3D icon={Trash2} {...props} />;

// Time & Calendar Icons
export const CalendarIcon = (props: any) => <Icon3D icon={Calendar} {...props} />;
export const ClockIcon = (props: any) => <Icon3D icon={Clock} {...props} />;
export const TimerIcon = (props: any) => <Icon3D icon={Timer} {...props} />;

// Location & Map Icons
export const MapPinIcon = (props: any) => <Icon3D icon={MapPin} {...props} />;

// Communication Icons
export const BellIcon = (props: any) => <Icon3D icon={Bell} {...props} />;
export const MessageIcon = (props: any) => <Icon3D icon={MessageCircle} {...props} />;
export const SendIcon = (props: any) => <Icon3D icon={Send} {...props} />;

// File & Document Icons
export const FileIcon = (props: any) => <Icon3D icon={FileText} {...props} />;
export const FolderIcon = (props: any) => <Icon3D icon={Folder} {...props} />;

// Tech & System Icons
export const MonitorIcon = (props: any) => <Icon3D icon={Monitor} {...props} />;
export const ServerIcon = (props: any) => <Icon3D icon={Server} {...props} />;
export const DatabaseIcon = (props: any) => <Icon3D icon={Database} {...props} />;
export const CloudIcon = (props: any) => <Icon3D icon={Cloud} {...props} />;
export const NetworkIcon = (props: any) => <Icon3D icon={Network} {...props} />;

// Media Icons
export const PlayIcon = (props: any) => <Icon3D icon={Play} {...props} />;
export const PauseIcon = (props: any) => <Icon3D icon={Pause} {...props} />;
export const ImageIcon = (props: any) => <Icon3D icon={Image} {...props} />;
export const VideoIcon = (props: any) => <Icon3D icon={Video} {...props} />;

// Search & Filter Icons
export const SearchIcon = (props: any) => <Icon3D icon={Search} {...props} />;
export const FilterIcon = (props: any) => <Icon3D icon={Filter} {...props} />;

// Utility Icons
export const EyeIcon = (props: any) => <Icon3D icon={Eye} {...props} />;
export const CopyIcon = (props: any) => <Icon3D icon={Copy} {...props} />;
export const ShareIcon = (props: any) => <Icon3D icon={Share2} {...props} />;
export const LinkIcon = (props: any) => <Icon3D icon={Link} {...props} />;
export const HelpIcon = (props: any) => <Icon3D icon={HelpCircle} {...props} />;

// Number badges for steps
export const NumberBadge = ({ number, active = false, completed = false }: { number: number; active?: boolean; completed?: boolean }) => (
  <div 
    style={{
      width: '40px',
      height: '40px',
      borderRadius: '50%',
      background: completed ? 'linear-gradient(135deg, #10B981 0%, #059669 100%)' : 
                  active ? 'linear-gradient(135deg, #3B82F6 0%, #2563EB 100%)' : 
                  'linear-gradient(135deg, #F1F5F9 0%, #E2E8F0 100%)',
      color: completed || active ? 'white' : '#64748B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: '700',
      fontSize: '1rem',
      boxShadow: completed || active ? '0 4px 12px rgba(59, 130, 246, 0.3)' : '0 2px 4px rgba(0, 0, 0, 0.1)',
      transition: 'all 0.3s ease',
      border: `2px solid ${completed ? '#10B981' : active ? '#3B82F6' : '#E0E7FF'}`
    }}
  >
    {completed ? <CheckIcon size={20} color="white" hover={false} /> : number}
  </div>
);