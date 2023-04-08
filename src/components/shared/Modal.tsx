import { Dispatch, SetStateAction, ReactNode } from "react";
import { Modal as DefaultModal, Pressable, ScrollView } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import Colors from "../../constants/Colors";
import Icon from "./Icon";
import View from "./View";

interface ModalProps {
  children: ReactNode;
  open: boolean;
  setOpen?: Dispatch<SetStateAction<boolean>>;
}

const Modal = ({ children, open, setOpen }: ModalProps) => {
  const insets = useSafeAreaInsets();

  return (
    <DefaultModal
      style={{
        height: "100%",
        paddingTop: insets.top,
      }}
      animationType="fade"
      transparent={true}
      visible={open}
      onRequestClose={() => {
        setOpen && setOpen(!open);
      }}
    >
      <View>
        <View
          style={{
            paddingVertical: 10,
            width: "100%",
            backgroundColor: Colors.primary,
            borderBottomLeftRadius: 15,
            borderBottomRightRadius: 15,
          }}
        >
          <ScrollView>
            {setOpen && (
              <Pressable
                style={{
                  position: "absolute",
                  padding: 10,
                  top: 0,
                  right: 5,
                  zIndex: 50,
                }}
                onPress={() => setOpen && setOpen(!open)}
              >
                <Icon
                  style={{
                    fontWeight: "bold",
                    textAlign: "center",
                  }}
                  color={Colors.red}
                  size={20}
                  name="close"
                />
              </Pressable>
            )}
            <View
              style={{
                width: "100%",
                borderBottomLeftRadius: 15,
                borderBottomRightRadius: 15,
              }}
            >
              {children}
            </View>
          </ScrollView>
        </View>
      </View>
    </DefaultModal>
  );
};

export default Modal;
