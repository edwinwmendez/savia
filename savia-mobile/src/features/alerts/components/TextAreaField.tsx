import { View, Text, TextInput, StyleSheet } from 'react-native';
import { colors } from '@/shared/theme/colors';
import { fontSize, fontFamily, fontWeight } from '@/shared/theme/typography';
import { spacing, radius } from '@/shared/theme/spacing';
import { useState } from 'react';

interface TextAreaFieldProps {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  maxLength: number;
  error?: string;
}

export function TextAreaField({
  label,
  value,
  onChangeText,
  placeholder,
  maxLength,
  error,
}: TextAreaFieldProps) {
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        style={[
          styles.input,
          isFocused && styles.inputFocused,
          error && styles.inputError,
        ]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textSecondary}
        maxLength={maxLength}
        multiline
        textAlignVertical="top"
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
      />
      <View style={styles.footer}>
        {error ? (
          <Text style={styles.errorText}>{error}</Text>
        ) : (
          <View />
        )}
        <Text style={styles.counter}>{value.length}/{maxLength}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    fontSize: fontSize.bodySmall,
    fontFamily: fontFamily.medium,
    fontWeight: fontWeight.medium,
    color: colors.textPrimary,
  },
  input: {
    height: 120,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.md,
    padding: spacing.md,
    fontSize: fontSize.body,
    fontFamily: fontFamily.regular,
    color: colors.textPrimary,
    lineHeight: fontSize.body * 1.5,
  },
  inputFocused: {
    borderColor: colors.primary,
    borderWidth: 2,
    padding: spacing.md - 1,
  },
  inputError: {
    borderColor: colors.error,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  errorText: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    color: colors.error,
  },
  counter: {
    fontSize: fontSize.caption,
    fontFamily: fontFamily.regular,
    fontWeight: fontWeight.regular,
    color: colors.textSecondary,
  },
});
