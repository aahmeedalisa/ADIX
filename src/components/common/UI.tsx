import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  Pressable,
  TextInput,
  FlatList,
  RefreshControl,
  ActivityIndicator,
  ViewStyle,
  TextStyle,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { LinearGradient } from 'expo-linear-gradient';
import { Image } from 'expo-image';
import { COLORS } from '../../constants/theme';
import { Product } from '../../types';
import { money } from '../../constants/catalog';

export const C = COLORS;

export const Icon: React.FC<{
  name: any;
  size?: number;
  color?: string;
  style?: any;
}> = ({ name, size = 22, color = C.white, style }) => (
  <Ionicons name={name} size={size} color={color} style={style} />
);

export const Txt: React.FC<{
  children?: React.ReactNode;
  style?: TextStyle | TextStyle[] | any;
  bold?: boolean;
  numberOfLines?: number;
  [key: string]: any;
}> = ({ children, style, bold = false, numberOfLines, ...rest }) => (
  <Text
    {...rest}
    numberOfLines={numberOfLines}
    style={[
      {
        color: C.white,
        fontFamily: bold ? 'Tajawal-Bold' : 'Tajawal',
        textAlign: 'right',
        fontSize: 15,
        lineHeight: 23,
      },
      style,
    ]}
  >
    {children}
  </Text>
);

export const Button: React.FC<{
  label: string;
  onPress: () => void;
  icon?: any;
  secondary?: boolean;
  loading?: boolean;
  disabled?: boolean;
  style?: ViewStyle | ViewStyle[];
}> = ({ label, onPress, icon, secondary = false, loading = false, disabled = false, style }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    disabled={disabled || loading}
    style={({ pressed, hovered }: any) => [
      s.button,
      secondary && s.secondary,
      {
        opacity: disabled ? 0.4 : pressed ? 0.72 : 1,
        backgroundColor: secondary
          ? hovered
            ? '#252525'
            : '#1A1A1A'
          : hovered
          ? '#E0E0E0'
          : '#FFFFFF',
      },
      style,
    ]}
  >
    {loading ? (
      <ActivityIndicator color={secondary ? 'white' : 'black'} />
    ) : (
      <>
        <Txt bold style={{ color: secondary ? 'white' : '#111', fontSize: 14 }}>
          {label}
        </Txt>
        {icon && <Icon name={icon} size={18} color={secondary ? 'white' : '#111'} />}
      </>
    )}
  </Pressable>
);

export const IconButton: React.FC<{
  icon: any;
  onPress: () => void;
  badge?: boolean;
  size?: number;
  style?: any;
  label?: string;
}> = ({ icon, onPress, badge, size = 20, style, label }) => (
  <Pressable
    accessibilityRole="button"
    accessibilityLabel={label || icon}
    onPress={onPress}
    style={({ hovered, pressed }: any) => [
      s.iconBtn,
      hovered && { backgroundColor: '#262626' },
      pressed && { opacity: 0.65 },
      style,
    ]}
  >
    <Icon name={icon} size={size} color="#DDD" />
    {badge && <View style={s.dot} />}
  </Pressable>
);

export const Field: React.FC<{
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  keyboardType?: any;
  multiline?: boolean;
  error?: string;
  maxLength?: number;
  autoCapitalize?: any;
  autoCorrect?: boolean;
  onSubmitEditing?: () => void;
  [key: string]: any;
}> = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  keyboardType,
  multiline,
  error,
  ...rest
}) => (
  <View style={{ gap: 8, marginBottom: 18 }}>
    {label && <Txt bold style={{ fontSize: 13 }}>{label}</Txt>}
    <TextInput
      accessibilityLabel={label}
      value={value}
      onChangeText={onChangeText}
      placeholder={placeholder}
      placeholderTextColor="#666"
      secureTextEntry={secureTextEntry}
      keyboardType={keyboardType || 'default'}
      multiline={multiline}
      returnKeyType={multiline ? 'default' : 'done'}
      style={[
        s.input,
        multiline && { height: 115, textAlignVertical: 'top' },
        error ? { borderColor: '#d27c7c' } : null,
      ]}
      {...rest}
    />
    {error ? <Txt style={{ color: '#dc9999', fontSize: 12 }}>{error}</Txt> : null}
  </View>
);

export const Page: React.FC<{
  children: React.ReactNode;
  style?: ViewStyle | ViewStyle[];
  refreshing?: boolean;
  onRefresh?: () => void;
}> = ({ children, style, refreshing = false, onRefresh }) => (
  <FlatList
    data={[1]}
    keyExtractor={() => 'content'}
    showsVerticalScrollIndicator={false}
    contentContainerStyle={[s.page, style]}
    renderItem={() => <>{children}</>}
    refreshControl={
      onRefresh ? (
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="white" />
      ) : undefined
    }
  />
);

export const Title: React.FC<{
  title: string;
  subtitle?: string;
  action?: string;
  onAction?: () => void;
}> = ({ title, subtitle, action, onAction }) => (
  <View style={s.titleRow}>
    <View style={{ flex: 1 }}>
      <Txt bold style={s.title}>{title}</Txt>
      {subtitle ? <Txt style={s.subtitle}>{subtitle}</Txt> : null}
    </View>
    {action && (
      <Pressable onPress={onAction} accessibilityRole="button" style={s.more}>
        <Txt style={{ fontSize: 12, color: '#aaa' }}>{action}</Txt>
        <Icon name="arrow-back" size={16} color="#aaa" />
      </Pressable>
    )}
  </View>
);

export const Empty: React.FC<{
  icon?: any;
  title: string;
  body: string;
  action?: string;
  onAction?: () => void;
}> = ({ icon = 'cube-outline', title, body, action, onAction }) => (
  <View style={s.empty}>
    <View style={s.emptyIcon}>
      <Icon name={icon} size={34} color="#bbb" />
    </View>
    <Txt bold style={{ fontSize: 22, textAlign: 'center' }}>{title}</Txt>
    <Txt style={{ color: C.muted, textAlign: 'center', maxWidth: 360 }}>{body}</Txt>
    {action && (
      <Button label={action} onPress={onAction || (() => {})} style={{ marginTop: 12, minWidth: 170 }} />
    )}
  </View>
);

export const ProductCard: React.FC<{
  product: Product;
  onPress: () => void;
  compact?: boolean;
}> = ({ product, onPress, compact = false }) => (
  <Pressable
    accessibilityRole="button"
    onPress={onPress}
    style={({ hovered, pressed }: any) => [
      s.product,
      hovered && { borderColor: '#555', transform: [{ translateY: -3 }] },
      pressed && { opacity: 0.75 },
      compact && { flex: 1 },
    ]}
  >
    <View style={s.productImage}>
      {product.image ? (
        <Image
          source={product.image}
          style={StyleSheet.absoluteFill}
          contentFit="cover"
          transition={250}
        />
      ) : (
        <LinearGradient colors={['#282828', '#161616']} style={s.brandImage}>
          <Icon name={product.icon} size={48} color={product.color || 'white'} />
          <Txt bold style={{ fontSize: 13 }}>{product.name}</Txt>
        </LinearGradient>
      )}
      <LinearGradient colors={['transparent', 'rgba(0,0,0,0.55)']} style={StyleSheet.absoluteFill} />
      {product.tag && (
        <View style={s.tag}>
          <Txt style={{ fontSize: 9, lineHeight: 15 }} bold>
            {product.tag}
          </Txt>
        </View>
      )}
    </View>
    <View style={s.productBody}>
      <Txt bold numberOfLines={1} style={{ fontSize: 15 }}>
        {product.name}
      </Txt>
      <Txt numberOfLines={1} style={{ fontSize: 11, color: C.muted }}>
        {product.subtitle}
      </Txt>
      <View style={s.productBottom}>
        <View style={{ alignItems: 'flex-end' }}>
          <Txt style={{ fontSize: 10, color: '#888', lineHeight: 16 }}>تبدأ من</Txt>
          <Txt bold style={{ fontSize: 18, lineHeight: 24 }}>{money(product.price)}</Txt>
        </View>
        <View style={s.smallArrow}>
          <Icon name="arrow-back" size={16} color="#ddd" />
        </View>
      </View>
    </View>
  </Pressable>
);

export const Note: React.FC<{
  children: React.ReactNode;
  icon?: any;
}> = ({ children, icon = 'information-circle-outline' }) => (
  <View style={s.note}>
    <Icon name={icon} color="#aaa" size={18} />
    <Txt style={{ color: '#aaa', fontSize: 12, flex: 1, lineHeight: 21 }}>{children}</Txt>
  </View>
);

export const s = StyleSheet.create({
  page: {
    padding: 30,
    paddingTop: 27,
    paddingBottom: 40,
  },
  titleRow: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 14,
    marginBottom: 17,
  },
  title: {
    fontSize: 22,
    lineHeight: 31,
  },
  subtitle: {
    fontSize: 12,
    color: C.muted,
    lineHeight: 20,
  },
  more: {
    flexDirection: 'row-reverse',
    gap: 9,
    alignItems: 'center',
    paddingVertical: 8,
  },
  button: {
    minHeight: 46,
    paddingHorizontal: 22,
    borderRadius: 10,
    flexDirection: 'row-reverse',
    gap: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  secondary: {
    borderWidth: 1,
    borderColor: '#383838',
  },
  iconBtn: {
    width: 41,
    height: 41,
    borderWidth: 1,
    borderColor: C.border,
    backgroundColor: '#161616',
    borderRadius: 11,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dot: {
    position: 'absolute',
    top: 8,
    right: 10,
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#151515',
  },
  input: {
    backgroundColor: '#191919',
    borderWidth: 1,
    borderColor: '#333',
    minHeight: 49,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    color: 'white',
    fontSize: 14,
    fontFamily: 'Tajawal',
    textAlign: 'right',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 65,
    paddingHorizontal: 25,
    gap: 12,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: '#1c1c1c',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  product: {
    backgroundColor: C.card,
    borderWidth: 1,
    borderColor: C.border,
    borderRadius: 13,
    overflow: 'hidden',
    flex: 1,
    minWidth: 0,
  },
  productImage: {
    height: 120,
    backgroundColor: '#222',
    overflow: 'hidden',
  },
  brandImage: {
    width: '100%',
    height: '100%',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
  },
  tag: {
    position: 'absolute',
    right: 9,
    top: 9,
    backgroundColor: 'rgba(15,15,15,0.85)',
    borderColor: '#666',
    borderWidth: 1,
    paddingHorizontal: 9,
    paddingVertical: 3,
    borderRadius: 5,
  },
  productBody: {
    padding: 13,
  },
  productBottom: {
    marginTop: 9,
    paddingTop: 9,
    borderTopWidth: 1,
    borderTopColor: '#292929',
    flexDirection: 'row-reverse',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  smallArrow: {
    width: 30,
    height: 30,
    backgroundColor: '#242424',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  note: {
    backgroundColor: '#1b1b1b',
    padding: 14,
    borderRadius: 10,
    flexDirection: 'row-reverse',
    gap: 10,
    alignItems: 'flex-start',
    borderWidth: 1,
    borderColor: '#303030',
  },
  panel: {
    backgroundColor: C.panel,
    padding: 22,
    borderRadius: 15,
    borderColor: C.border,
    borderWidth: 1,
  },
  row: {
    flexDirection: 'row-reverse',
    alignItems: 'center',
    gap: 12,
  },
  line: {
    height: 1,
    backgroundColor: C.border,
    marginVertical: 18,
  },
  section: {
    marginTop: 29,
  },
  muted: {
    color: C.muted,
  },
  badge: {
    borderRadius: 6,
    paddingHorizontal: 10,
    paddingVertical: 4,
    backgroundColor: '#282828',
  },
});
