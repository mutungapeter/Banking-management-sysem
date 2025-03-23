import { IconType } from 'react-icons';
import { BsBarChart, BsWindowPlus } from 'react-icons/bs';
import {
  FiRepeat,
  FiUser
} from 'react-icons/fi';
import { LuCircleMinus, LuCirclePlus } from 'react-icons/lu';

interface MenuItem {
  path: string;
  label: string;
  icon: IconType;
}

export const menuItems: MenuItem[] = [

  {
    path: '/dashboard',
    label: 'Dashboard',
    icon: BsBarChart
  },
  {
    path: '/transfer',
    label: 'Transfer',
    icon: FiRepeat
  },
  {
    path: '/deposit',
    label: 'Deposit',
    icon:LuCirclePlus
  },
  {
    path: '/create-account',
    label: 'New Bank Account',
    icon:BsWindowPlus
  },
  {
    path: '/withdraw',
    label: 'Withdraw',
    icon: LuCircleMinus
  },
  {
    path: '/profile',
    label: 'Profile',
    icon: FiUser
  },
  // {
  //   href: '/login',
  //   label: 'Login',
  //   icon: FiLogIn
  // },
  // {
  //   href: '/logout',
  //   label: 'Logout',
  //   icon: FiLogOut
  // },
  // {
  //   href: '/register',
  //   label: 'Register',
  //   icon: FiUserPlus
  // }
]; 
