# Руководство по прозрачному Header

## Обзор
Header компонент теперь поддерживает прозрачный фон по умолчанию, что создает более современный и элегантный внешний вид.

## Изменения

### StatusBar
- `backgroundColor: "transparent"`
- `translucent: true`
- Автоматическое определение стиля контента (светлый/темный)

### Header фон
- По умолчанию: `transparent`
- Убрана нижняя граница (`borderBottomWidth: 0`)
- Возможность настройки через параметры

## Использование

### Прозрачный header (по умолчанию)
```tsx
import Header from '../components/Header';

<Header title="Заголовок" />
```

### Непрозрачный header
```tsx
<Header 
  title="Заголовок" 
  transparent={false} 
/>
```

### Кастомный цвет фона
```tsx
<Header 
  title="Заголовок" 
  backgroundColor="rgba(255, 255, 255, 0.9)" 
/>
```

### Полностью кастомизированный header
```tsx
<Header 
  title="Заголовок"
  transparent={false}
  backgroundColor="#FC094C"
  textColor="white"
  rightComponent={
    <TouchableOpacity>
      <Ionicons name="settings" size={24} color="white" />
    </TouchableOpacity>
  }
/>
```

## Параметры Header

| Параметр | Тип | По умолчанию | Описание |
|----------|-----|--------------|----------|
| `title` | `string` | - | Заголовок header |
| `showBackButton` | `boolean` | `true` | Показать кнопку назад |
| `rightComponent` | `ReactNode` | - | Компонент справа |
| `onBackPress` | `function` | - | Обработчик кнопки назад |
| `backgroundColor` | `string` | - | Цвет фона |
| `textColor` | `string` | - | Цвет текста |
| `transparent` | `boolean` | `true` | Прозрачный фон |

## Примеры экранов

### DrivingScreen (прозрачный)
```tsx
<SafeAreaView style={{flex: 1, backgroundColor: bgColor}}>
  <Header title="Вождение" />
  <ScrollView>
    {/* Контент */}
  </ScrollView>
</SafeAreaView>
```

### ThemeSettingsScreen (прозрачный)
```tsx
<SafeAreaView style={{ flex: 1, backgroundColor: bgColor }}>
  <Header title="Настройки темы" />
  <ScrollView>
    {/* Контент */}
  </ScrollView>
</SafeAreaView>
```

## Визуальные эффекты

### Преимущества прозрачного header:
1. **Современный вид** - более элегантный интерфейс
2. **Больше пространства** - контент может "проглядывать" под header
3. **Единообразие** - все экраны выглядят согласованно
4. **Гибкость** - легко настроить под конкретные нужды

### Когда использовать непрозрачный header:
1. **Сложный фон** - когда нужна четкая граница
2. **Важная информация** - когда header должен выделяться
3. **Брендинг** - для специальных цветовых схем

## Совместимость

### Темы
- Автоматически адаптируется к светлой/темной теме
- StatusBar меняется в соответствии с темой
- Цвета текста и иконок подстраиваются автоматически

### Существующие экраны
- Все экраны, использующие Header, автоматически получили прозрачный фон
- Никаких дополнительных изменений не требуется
- Обратная совместимость сохранена

## Кастомизация для конкретных экранов

Если нужно изменить поведение для конкретного экрана:

```tsx
// Полупрозрачный header
<Header 
  title="Специальный экран"
  backgroundColor="rgba(255, 255, 255, 0.95)"
/>

// Header с градиентом (требует дополнительной обертки)
<View>
  <LinearGradient colors={['transparent', 'rgba(0,0,0,0.1)']}>
    <Header title="Градиент" backgroundColor="transparent" />
  </LinearGradient>
</View>
```

## Результат

Теперь все экраны с Header имеют:
- ✅ Прозрачный фон по умолчанию
- ✅ Современный внешний вид
- ✅ Гибкие настройки
- ✅ Поддержку тем
- ✅ Обратную совместимость
