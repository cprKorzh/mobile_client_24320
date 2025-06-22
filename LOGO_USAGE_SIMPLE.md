# Использование логотипа в приложении

## Простое использование

Теперь вы можете легко добавить логотип в любое место вашего приложения:

### 1. Простой логотип
```tsx
import { Logo } from '../components/Logo';

<View style={styles.logoContainer}>
  <View style={styles.iconBackground}>
    <Logo width={48} height={48} />
  </View>
</View>
```

### 2. Логотип с контейнером (рекомендуется)
```tsx
import { LogoContainer } from '../components/LogoContainer';

// Обычный логотип с фоном
<LogoContainer size="medium" variant="default" />

// Логотип с границей
<LogoContainer size="large" variant="outlined" />

// Прозрачный логотип
<LogoContainer size="small" variant="transparent" />
```

### 3. Для вашего конкретного случая:
```tsx
<View style={styles.logoContainer}>
  <View style={styles.iconBackground}>
    <Logo width={48} height={48} />
  </View>
</View>
```

Или еще проще:
```tsx
<View style={styles.logoContainer}>
  <LogoContainer size="medium" variant="transparent" />
</View>
```

## Размеры

- **small**: 64x64 контейнер, 32x32 логотип
- **medium**: 96x96 контейнер, 48x48 логотип  
- **large**: 128x128 контейнер, 64x64 логотип

## Варианты

- **default**: с полупрозрачным фоном и тенью
- **outlined**: с границей, без фона
- **transparent**: только логотип, без фона

## Готово к использованию!

Логотип теперь использует PNG изображение из `assets/icon.png` и работает без дополнительных библиотек.
