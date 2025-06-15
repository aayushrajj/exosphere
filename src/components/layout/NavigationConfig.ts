
import { 
  MessageSquare, 
  Calendar, 
  Mail, 
  FileText, 
  TrendingUp,
  Info,
  Building2
} from 'lucide-react';

export interface NavigationItem {
  name: string;
  icon: any;
  path: string;
}

export const navigationItems: NavigationItem[] = [
  { name: 'Dashboard', icon: TrendingUp, path: '/dashboard' },
  { name: 'Chat', icon: MessageSquare, path: '/chat' },
  { name: 'Scheduler', icon: Calendar, path: '/scheduler' },
  { name: 'Emails', icon: Mail, path: '/emails' },
  { name: 'Audit', icon: FileText, path: '/audit' },
  { name: 'Your Organisation', icon: Building2, path: '/your-organisation' },
  { name: 'About', icon: Info, path: '/about' },
];
