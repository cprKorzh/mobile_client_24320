# Руководство по стилям Header

## Обзор
Этот документ описывает единые стили для header компонентов в мобильном приложении.

## Общие принципы

### Отступы
- **Горизонтальные отступы**: 16px для всех экранов
- **Вертикальные отступы**: 16px для стандартных header
- **Специальные случаи**: ProfileScreen использует увеличенные отступы (24px)

### Компоненты

#### 1. Header компонент (`src/components/Header.tsx`)
Универсальный компонент для экранов с навигацией назад.

**Использование:**
```tsx
import Header from '../components/Header';

<Header title="Название экрана" />
```

**Стили:**
- `paddingHorizontal: 16px`
- `paddingVertical: 16px`
- `fontSize: 18px` для заголовка

#### 2. Общие стили (`src/constants/styles.ts`)

**CommonStyles.screenHeaderWithBack:**
- Для экранов с кнопкой "Назад"
- `paddingHorizontal: 16px`
- `paddingVertical: 16px`

**CommonStyles.mainScreenHeader:**
- Для главных экранов (Home, Profile)
- `paddingHorizontal: 16px`
- `paddingTop: 16px`
- `paddingBottom: 16px`

## Примеры использования

### DrivingScreen (обновлен)
```tsx
import Header from '../../components/Header';

export const DrivingScreen: React.FC = () => {
    return (
        <SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
            <Header title="Вождение" />
            {/* Контент экрана */}
        </SafeAreaView>
    );
};
```

### HomeScreen
```tsx
import {CommonStyles, SPACING} from '../constants/styles';

const styles = StyleSheet.create({
    header: {
        ...CommonStyles.mainScreenHeader,
        paddingTop: SPACING.lg,
        paddingBottom: SPACING.lg,
    },
});
```

### ProfileScreen
```tsx
import {CommonStyles, SPACING, FONT_SIZES} from '../constants/styles';

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: SPACING.xxl, // 24px
        paddingTop: SPACING.lg,         // 16px
        paddingBottom: SPACING.xxl,     // 24px
    },
    title: {
        ...CommonStyles.headerTitleLarge, // 28px
    },
});
```

## Константы

### SPACING
- `xs: 4px`
- `sm: 8px`
- `md: 12px`
- `lg: 16px` ← **Стандартный отступ для header**
- `xl: 20px`
- `xxl: 24px` ← **Увеличенный отступ для ProfileScreen**

### FONT_SIZES
- `large: 18px` ← **Стандартный размер заголовка header**
- `xlarge: 20px`
- `xxlarge: 24px`
- `xxxlarge: 28px` ← **Размер заголовка ProfileScreen**

## Рекомендации

1. **Используйте Header компонент** для экранов с навигацией назад
2. **Используйте CommonStyles** для кастомных header
3. **Используйте константы SPACING и FONT_SIZES** вместо магических чисел
4. **Поддерживайте единообразие** отступов между экранами

## Изменения

### Что было изменено в DrivingScreen:
- Удален кастомный header код
- Добавлен импорт `Header` компонента
- Заменен `<View style={styles.header}>` на `<Header title="Вождение" />`
- Удалены неиспользуемые стили header из StyleSheet

### Результат:
- Единообразные отступы со всеми экранами
- Меньше дублирования кода
- Легче поддерживать и обновлять стили
