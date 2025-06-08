import { 
  CheckBadgeIcon, 
  ClipboardDocumentCheckIcon, 
  ClipboardDocumentListIcon, 
  CreditCardIcon, 
  EllipsisHorizontalIcon, 
  TruckIcon, 
  UserIcon 
} from '@heroicons/react/24/outline';
import { Step, Stepper } from 'react-form-stepper';
import { StepStyleDTO } from 'react-form-stepper/dist/components/Step/StepTypes';

interface StatusProps {
  status: string,
  method: string,
}

const stepStyles: StepStyleDTO = {
  activeBgColor: '#38a59f',
  activeTextColor: '#ffffff',
  completedBgColor: '#f44336',
  completedTextColor: '#f44336',
  inactiveBgColor: '#d4d4d4',
  inactiveTextColor: '#ffffff',
  size: 50,
  circleFontSize: 20,
  labelFontSize: 12,
  borderRadius: 50,
  fontWeight: 'bold',
};

const CODStatus = [
  { index: 0, name: 'PENDING', label: 'Pending', icon: <UserIcon className='size-7' /> },
  { index: 1, name: 'PROCESSING', label: 'Processing', icon: <EllipsisHorizontalIcon className='size-7' /> },
  { index: 2, name: 'READY_TO_SHIP', label: 'Awaiting Shipment', icon: <TruckIcon className='size-7' /> },
  { index: 3, name: 'IN_TRANSIT', label: 'IN_TRANSIT', icon: <ClipboardDocumentListIcon className='size-7' /> },
  { index: 4, name: 'DELIVERED', label: 'Delivered', icon: <ClipboardDocumentCheckIcon className='size-7' /> },
];
const VNPayStatus = [
  { index: 0, name: 'AWAITING_PAYMENT', label: 'Awaiting Payment', icon: <CreditCardIcon className='size-7' /> },
  { index: 1, name: 'PAID', label: 'Paid', icon: <CheckBadgeIcon className='size-7' /> },
  { index: 2, name: 'PROCESSING', label: 'Processing', icon: <EllipsisHorizontalIcon className='size-7' /> },
  { index: 3, name: 'READY_TO_SHIP', label: 'Awaiting Shipment', icon: <TruckIcon className='size-7' /> },
  { index: 4, name: 'IN_TRANSIT', label: 'IN_TRANSIT', icon: <ClipboardDocumentListIcon className='size-7' /> },
  { index: 5, name: 'DELIVERED', label: 'Delivered', icon: <ClipboardDocumentCheckIcon className='size-7' /> },
];

const Status: React.FC<StatusProps> = ({ status, method }) => {
  if (method === "COD") {
    const currentStatus = CODStatus.find(item => item.name === status);
    return (
      <Stepper activeStep={currentStatus ? currentStatus.index : 0}>
        {CODStatus.map((item) => (
          <Step key={item.index} label={item.label} styleConfig={stepStyles}>
            {item.icon}
          </Step>
        ))}
      </Stepper>
    )
  }
  else {
    const currentStatus = VNPayStatus.find(item => item.name === status);
    return (
      <Stepper activeStep={currentStatus ? currentStatus.index : 0}>
        {VNPayStatus.map((item) => (
          <Step key={item.index} label={item.label} styleConfig={stepStyles}>
            {item.icon}
          </Step>
        ))}
      </Stepper>
    )
  }
}

export default Status;