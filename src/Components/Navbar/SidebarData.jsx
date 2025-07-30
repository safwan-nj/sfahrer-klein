import * as FaIcons from 'react-icons/fa6';
import * as AiIcons from 'react-icons/ai';
import * as IoIcons from 'react-icons/io';

export const SidebarData = [
  {
    title: 'Home',
    path: '/',
    icon: <AiIcons.AiFillHome />,
    cName: 'nav-text'
  },
  {
    title: 'TourList',
    path: '/tourlist',
    icon: <IoIcons.IoIosPaper />,
    cName: 'nav-text'
  },
  /* {
    title: 'Tour-Map',
    path: '/tour',
    icon: <FaIcons.FaMapLocationDot />,
    cName: 'nav-text'
  }, */
  {
    title: 'Final',
    path: '/final',
    icon: <FaIcons.FaBuildingFlag />,
    cName: 'nav-text'
  },
  {
    title: 'Tutorial',
    path: '/tutorial',
    icon: <FaIcons.FaUserGraduate  />,
    cName: 'nav-text'
  },
  {
    title: 'Retour',
    path: '/retour',
    icon: <FaIcons.FaCartArrowDown />,
    cName: 'nav-text'
  },
  {
    title: 'Support',
    path: '/support',
    icon: <IoIcons.IoMdHelpCircle />,
    cName: 'nav-text'
  }
];