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
  ...inputProps
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
          isFocused && !error && styles.focusShadow,
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
          style={[
            styles.input,
            IconLeft ? { paddingLeft: 0 } : null,
            IconRight ? { paddingRight: 0 } : null,
          ]}
          placeholderTextColor={colors.textSecondary}
          editable={!disabled}
          onFocus={(e) => {
            setIsFocused(true);
            inputProps.onFocus?.(e);
          }}
          onBlur={(e) => {
            setIsFocused(false);
            inputProps.onBlur?.(e);
          }}
          {...inputProps}
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
  focusShadow: {
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 2,
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
