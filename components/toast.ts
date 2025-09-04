import Toast from "react-native-toast-message";

type ToastType = "success" | "error" | "info";

export const showToast = ({
  type,
  text1,
  text2,
}: {
  type: ToastType;
  text1: string;
  text2?: string;
}) => {
  Toast.show({
    type,
    text1,
    text2,
    visibilityTime: 3000, 
    autoHide: true,
    
  });
};