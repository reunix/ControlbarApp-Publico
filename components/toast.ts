import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export const showToast = ({
  type,
  text1,
  text2,
  time = 3000
}: {
  type: ToastType;
  text1: string;
  text2?: string;
  time?: number;
}) => {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime: time, 
    autoHide: true,
    
  });
};