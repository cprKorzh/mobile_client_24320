# Руководство по тематическим компонентам

## Обзор
Созданы новые компоненты для единообразного дизайна в тематике приложения с поддержкой светлой и темной тем.

## Компоненты

### 1. ThemedInput (`src/components/ThemedInput.tsx`)

Улучшенный компонент ввода с границами в тематике приложения.

#### Особенности:
- **Тематические границы** с акцентным цветом `#FC094C`
- **Состояния фокуса** с изменением цвета границы
- **Иконки** слева от поля ввода
- **Переключатель пароля** для полей с паролем
- **Валидация** с отображением ошибок
- **Многострочный ввод** для больших текстов
- **Поддержка тем** (светлая/темная)

#### Использование:
```tsx
import { ThemedInput } from '../components/ThemedInput';

// Обычное поле
<ThemedInput
  label="Имя"
  value={name}
  onChangeText={setName}
  placeholder="Введите ваше имя"
  icon="person-outline"
/>

// Поле с паролем
<ThemedInput
  label="Пароль"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  showPasswordToggle={true}
  icon="lock-closed-outline"
  error={passwordError}
/>

// Многострочное поле
<ThemedInput
  label="Адрес"
  value={address}
  onChangeText={setAddress}
  multiline={true}
  numberOfLines={3}
  icon="location-outline"
/>
```

#### Параметры:
| Параметр | Тип | Описание |
|----------|-----|----------|
| `label` | `string` | Заголовок поля |
| `value` | `string` | Значение |
| `onChangeText` | `function` | Обработчик изменения |
| `placeholder` | `string` | Подсказка |
| `keyboardType` | `string` | Тип клавиатуры |
| `secureTextEntry` | `boolean` | Скрытый ввод |
| `showPasswordToggle` | `boolean` | Показать переключатель пароля |
| `error` | `string` | Текст ошибки |
| `icon` | `string` | Иконка слева |
| `multiline` | `boolean` | Многострочный ввод |
| `numberOfLines` | `number` | Количество строк |

### 2. ThemedButton (`src/components/ThemedButton.tsx`)

Универсальный компонент кнопки с градиентами и иконками.

#### Варианты:
- **Primary** - основная кнопка с градиентом
- **Secondary** - вторичная кнопка
- **Outline** - кнопка с границей
- **Danger** - кнопка для опасных действий

#### Размеры:
- **Small** - маленькая кнопка
- **Medium** - средняя кнопка (по умолчанию)
- **Large** - большая кнопка

#### Использование:
```tsx
import { ThemedButton } from '../components/ThemedButton';

// Основная кнопка
<ThemedButton
  title="Сохранить"
  onPress={handleSave}
  icon="checkmark"
  iconPosition="right"
  fullWidth={true}
  size="large"
/>

// Вторичная кнопка
<ThemedButton
  title="Отмена"
  onPress={handleCancel}
  variant="secondary"
  size="medium"
/>

// Кнопка с границей
<ThemedButton
  title="Подробнее"
  onPress={handleMore}
  variant="outline"
  icon="information-circle"
/>

// Кнопка загрузки
<ThemedButton
  title="Войти"
  onPress={handleLogin}
  loading={isLoading}
  disabled={isLoading}
/>
```

#### Параметры:
| Параметр | Тип | Значения | Описание |
|----------|-----|----------|----------|
| `title` | `string` | - | Текст кнопки |
| `onPress` | `function` | - | Обработчик нажатия |
| `variant` | `string` | `primary`, `secondary`, `outline`, `danger` | Вариант стиля |
| `size` | `string` | `small`, `medium`, `large` | Размер |
| `disabled` | `boolean` | - | Отключена ли кнопка |
| `loading` | `boolean` | - | Состояние загрузки |
| `icon` | `string` | - | Иконка |
| `iconPosition` | `string` | `left`, `right` | Позиция иконки |
| `fullWidth` | `boolean` | - | На всю ширину |

## Цветовая схема

### Основные цвета:
- **Primary**: `#FC094C` → `#FF3366` (градиент)
- **Focus**: `#FC094C` (акцентный цвет)
- **Error**: `#FF3B30`
- **Success**: `#4CAF50`

### Светлая тема:
- Фон полей: `#FFFFFF`
- Границы: `#E0E0E0`
- Текст: `#000000`
- Подсказки: `#999999`

### Темная тема:
- Фон полей: `#2A2A2A`
- Границы: `#404040`
- Текст: `#FFFFFF`
- Подсказки: `#888888`

## Обновленные экраны

### LoginScreen
- **Современный дизайн** с градиентами и тенями
- **Валидация форм** с отображением ошибок
- **Адаптивная клавиатура** с KeyboardAvoidingView
- **Логотип приложения** с иконкой автомобиля
- **Состояния загрузки** с анимацией

### ProfileSettingsScreen
- **ThemedInput** для всех полей ввода
- **Иконки** для каждого типа поля
- **ThemedButton** для кнопки сохранения
- **Многострочное поле** для адреса

## Преимущества

### Единообразие:
- Все поля ввода выглядят одинаково
- Единая цветовая схема
- Согласованные отступы и размеры

### Функциональность:
- Автоматическая поддержка тем
- Валидация с отображением ошибок
- Состояния фокуса и взаимодействия
- Доступность и удобство использования

### Гибкость:
- Множество параметров настройки
- Различные варианты и размеры
- Поддержка иконок и специальных состояний

## Примеры использования

### Форма входа:
```tsx
<ThemedInput
  label="Email"
  value={email}
  onChangeText={setEmail}
  keyboardType="email-address"
  icon="mail-outline"
  error={emailError}
/>

<ThemedInput
  label="Пароль"
  value={password}
  onChangeText={setPassword}
  secureTextEntry={true}
  showPasswordToggle={true}
  icon="lock-closed-outline"
  error={passwordError}
/>

<ThemedButton
  title="Войти"
  onPress={handleLogin}
  loading={isLoading}
  fullWidth={true}
  size="large"
/>
```

### Форма профиля:
```tsx
<ThemedInput
  label="Имя"
  value={name}
  onChangeText={setName}
  icon="person-outline"
/>

<ThemedInput
  label="О себе"
  value={bio}
  onChangeText={setBio}
  multiline={true}
  numberOfLines={4}
  icon="document-text-outline"
/>

<ThemedButton
  title="Сохранить"
  onPress={handleSave}
  icon="checkmark"
  iconPosition="right"
/>
```

## Результат

Теперь приложение имеет:
- ✅ Единообразные поля ввода с тематическими границами
- ✅ Современный экран входа в стиле приложения
- ✅ Гибкие компоненты кнопок с градиентами
- ✅ Полную поддержку светлой и темной тем
- ✅ Валидацию и обработку ошибок
- ✅ Профессиональный внешний вид
