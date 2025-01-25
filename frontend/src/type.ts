export interface CourseCardProps {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    price: number;
    discount: number;
}

export interface AddCourseProps {
  onClose: () => void;
  onCourseAdded: () => void;
  initialData: CourseData;
  type: string;
}

export interface AddModuleProps {
  onClose: () => void;
  onModuleAdded: () => void;
  courseId: string;
}

export interface AddLessonProps {
  onClose: () => void;
  onLessonAdded: () => void;
  moduleId: string
}

export interface CourseData {
  title: string;
  description: string;
  imageUrl: string;
  price: number;
  discount: number;
}

export interface ModuleCardProps {
  id: string;
  title: string;
  order: number;
  moduleDeleted:() => void;
}

export interface Lesson {
  id: string;
  title: string;
  url: string;
  order: number;
}

export interface PurchaseResponse {
  name: string;
  image: string;
  orderId: string;
  amount: number;
  currency: string;
}

export interface RazorpayResponse {
  razorpay_payment_id: string;
  razorpay_order_id: string;
  razorpay_signature: string;
}

export interface RazorpayOptions {
  key: string;
  amount: number;
  currency: string;
  order_id: string;
  name: string;
  description: string;
  image?: string;
  handler: (response: RazorpayResponse) => void;
  prefill?: {
    name?: string;
    email?: string;
    contact?: string;
  };
  theme?: {
    color?: string;
  }
}

declare global{
  interface Window {
    Razorpay: new (options: RazorpayOptions) => {
      open: () =>void;
    }
    
  }
}

export interface TopBarProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}
