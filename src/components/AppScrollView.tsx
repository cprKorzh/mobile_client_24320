import React from 'react';
import { ScrollView, ScrollViewProps, Platform } from 'react-native';

interface AppScrollViewProps extends ScrollViewProps {
  children: React.ReactNode;
}

export const AppScrollView: React.FC<AppScrollViewProps> = ({ 
  children, 
  contentContainerStyle,
  ...props 
}) => {
  return (
    <ScrollView
      {...props}
      contentContainerStyle={[
        {
          flexGrow: 1,
          paddingBottom: Platform.OS === 'ios' ? 0 : 0, // Убираем отступ
        },
        contentContainerStyle,
      ]}
      contentInsetAdjustmentBehavior="never" // Для iOS
      automaticallyAdjustContentInsets={false} // Для iOS
      showsVerticalScrollIndicator={false}
    >
      {children}
    </ScrollView>
  );
};
