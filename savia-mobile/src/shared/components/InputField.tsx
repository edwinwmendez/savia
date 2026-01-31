import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Pressable,
  type TextInputProps,
} from 'react-native';
import type { LucideIcon } from 'lucide-react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius, iconSize, componentHeight } from '@/shared/theme/spacing';

interface InputFieldProps extends Omit<TextInputProps, 'style'> {
  label: string;
  error?: string;
  helperText?: string;
  iconLeft?: LucideIcon;
  iconRight?: LucideIcon;
  onPressIconRight?: () => void;
  disabled?: boolean;
}

export function InputField({
  label,
  error,
  helperText,
  iconLeft: IconLeft,
  iconRight: IconRight,
  onPressIconRight,
  disabled = false,
  onFocus: onFocusProp,
  onBlur: onBlurProp,
  ...restProps
}: InputFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  const borderColor = error
    ? colors.error
    : isFocused
      ? colors.primary
      : colors.border;

  return (
    <View style={[styles.wrapper, disabled && styles.disabled]}>
      <Text style={styles.label}>{label}</Text>
      <View
        style={[
          styles.container,
          { borderColor },
          isFocused && !error && styles.focusBorder,
        ]}
      >
        {IconLeft && (
          <IconLeft
            size={iconSize.md}
            color={colors.textSecondary}
            style={styles.iconLeft}
          />
        )}
        <TextInput
          {...restProps}
          style={[
            styles.input,
            IconLeft ? { paddingLeft: 0 } : null,
            IconRight ? { paddingRight: 0 } : null,
          ]}
          placeholderTextColor={colors.textSecondary}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            onFocusProp?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            onBlurProp?.(e);
          }}
        />
        {IconRight && (
          <Pressable
            onPress={onPressIconRight}
            hitSlop={8}
            disabled={disabled}
          >
            <IconRight
              size={iconSize.md}
              color={colors.textSecondary}
              style={styles.iconRight}
            />
          </Pressable>
        )}
      </View>
      {(error || helperText) && (
        <Text style={[styles.helperText, error && styles.errorText]}>
          {error ?? helperText}
        </Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    width: '100%',
  },
  disabled: {
    opacity: 0.6,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
    marginBottom: spacing.sm,
  },
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    height: componentHeight.input,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.lg,
    paddingHorizontal: spacing.md,
    gap: spacing.sm,
  },
  focusBorder: {
    borderWidth: 2,
    // Compensar el 1px extra en cada lado para evitar layout shift
    paddingHorizontal: spacing.md - 1,
  },
  iconLeft: {
    flexShrink: 0,
  },
  iconRight: {
    flexShrink: 0,
  },
  input: {
    flex: 1,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    height: '100%',
  },
  helperText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.textSecondary,
    marginTop: spacing.xs,
  },
  errorText: {
    color: colors.error,
  },
});
