import { useState } from 'react';
import {
  FlatList,
  Keyboard,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { COLORS } from '@/constants/style-constant';
import { Avatar } from '@/components/primitives/avatar';
import { Button } from '@/components/primitives/button';
import { PressableOpacity } from '@/components/primitives/pressable-opacity';
import { AntDesign, Feather, FontAwesome, Ionicons } from '@expo/vector-icons';
import { TourImplementationAdditionalDataResponse } from '@/interfaces/tour-implementation-interfaces';
import { UserResponse } from '@/interfaces/user-interfaces';
import { AdditionalEditFormData } from './tour-implementation-additional-edit-modal';
import { searchUsersApi } from '@/apis/user-apis';
import { useFetchFn } from 'fetchwire';

interface Props {
  selectedItem: TourImplementationAdditionalDataResponse;
  allAdditionalData: TourImplementationAdditionalDataResponse[] | undefined;
  isLoading?: boolean;
  onConfirm?: (data: AdditionalEditFormData) => void;
  onCloseRequest?: () => void;
}

export function TourImplementationAdditionalEditModalContent({
  selectedItem,
  allAdditionalData,
  isLoading = false,
  onConfirm,
  onCloseRequest,
}: Props) {
  const tourGuide = selectedItem.usersInvited.find((u) => u.role === 'TOUR_GUIDE');
  const driver = selectedItem.usersInvited.find((u) => u.role === 'DRIVER');

  const [selectedPosition, setSelectedPosition] = useState(selectedItem.position);
  const [showPositionPicker, setShowPositionPicker] = useState(false);

  // Tour Guide state
  const [tourGuideInputMode, setTourGuideInputMode] = useState<0 | 1>(
    (tourGuide?.currentOption ?? 0) as 0 | 1
  );
  const [tourGuideName, setTourGuideName] = useState(
    tourGuide?.customUserName ?? ''
  );
  const [tourGuidePhone, setTourGuidePhone] = useState(
    tourGuide?.customPhone ?? ''
  );
  const [tourGuideUserId, setTourGuideUserId] = useState<string | null>(
    tourGuide?.user?.id ?? null
  );
  const [tourGuideSearchQuery, setTourGuideSearchQuery] = useState(
    tourGuide?.user?.name ?? ''
  );

  // Driver state
  const [driverMode, setDriverMode] = useState<0 | 1>(
    (driver?.currentOption ?? 0) as 0 | 1
  );
  const [driverName, setDriverName] = useState(driver?.customUserName ?? '');
  const [driverPhone, setDriverPhone] = useState(driver?.customPhone ?? '');
  const [driverUserId, setDriverUserId] = useState<string | null>(
    driver?.user?.id ?? null
  );
  const [driverSearchQuery, setDriverSearchQuery] = useState(
    driver?.user?.name ?? ''
  );

  // Car state
  const [carName, setCarName] = useState(selectedItem.carName ?? '');

  const {
    data: tourGuideSearchResults,
    executeFetchFn: searchTourGuideUsers,
    isLoading: isSearchingTourGuide,
    reset: resetTourGuideSearch,
  } = useFetchFn(
    () =>
      searchUsersApi({
        name: tourGuideSearchQuery,
        phone: tourGuideSearchQuery,
        email: tourGuideSearchQuery,
      }),
    { tags: [] }
  );

  const {
    data: driverSearchResults,
    executeFetchFn: searchDriverUsers,
    isLoading: isSearchingDriver,
    reset: resetDriverSearch,
  } = useFetchFn(
    () =>
      searchUsersApi({
        name: driverSearchQuery,
        phone: driverSearchQuery,
        email: driverSearchQuery,
      }),
    { tags: [] }
  );

  const selectedTourGuideUser =
    tourGuideSearchResults?.find((u) => u.id === tourGuideUserId) ??
    (tourGuide?.user as UserResponse | null | undefined) ??
    null;

  const selectedDriverUser =
    driverSearchResults?.find((u) => u.id === driverUserId) ??
    (driver?.user as UserResponse | null | undefined) ??
    null;

  const handleSelectTourGuideUser = (user: UserResponse) => {
    setTourGuideUserId(user.id);
    setTourGuideSearchQuery(user.name ?? '');
    Keyboard.dismiss();
  };

  const handleSelectDriverUser = (user: UserResponse) => {
    setDriverUserId(user.id);
    setDriverSearchQuery(user.name ?? '');
    Keyboard.dismiss();
  };

  const handleConfirm = () => {
    Keyboard.dismiss();
    if (!tourGuide || !driver) return;

    onConfirm?.({
      additionalDataId: selectedItem.id,
      position: selectedPosition,
      carName,
      tourGuide: {
        id: tourGuide.id,
        currentOption: tourGuideInputMode,
        customUserName: tourGuideInputMode === 0 ? tourGuideName : '',
        customPhone: tourGuideInputMode === 0 ? tourGuidePhone : '',
        userId: tourGuideInputMode === 1 ? tourGuideUserId : null,
      },
      driver: {
        id: driver.id,
        currentOption: driverMode,
        customUserName: driverMode === 0 ? driverName : '',
        customPhone: driverMode === 0 ? driverPhone : '',
        userId: driverMode === 1 ? driverUserId : null,
      },
    });
  };

  // Position picker view
  if (showPositionPicker) {
    return (
      <View style={styles.container}>
        <View style={styles.pickerHeader}>
          <Text style={styles.pickerTitle}>Chọn vị trí</Text>
          <PressableOpacity
            onPress={() => setShowPositionPicker(false)}
            hitSlop={8}
          >
            <AntDesign name="close" size={20} color={COLORS.vinaupDarkGray} />
          </PressableOpacity>
        </View>
        <FlatList
          data={allAdditionalData ?? []}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => {
            const isSelected = item.position === selectedPosition;
            return (
              <PressableOpacity
                style={[
                  styles.positionPickerItem,
                  isSelected && styles.positionPickerItemSelected,
                ]}
                onPress={() => {
                  setSelectedPosition(item.position);
                  setShowPositionPicker(false);
                }}
              >
                <Text
                  style={[
                    styles.positionPickerText,
                    isSelected && styles.positionPickerTextSelected,
                  ]}
                >
                  {String(item.position).padStart(2, '0')}
                </Text>
                <Ionicons
                  name={
                    isSelected ? 'radio-button-on-sharp' : 'radio-button-off-sharp'
                  }
                  size={24}
                  color={isSelected ? COLORS.vinaupTeal : COLORS.vinaupLightGray}
                />
              </PressableOpacity>
            );
          }}
        />
      </View>
    );
  }

  // Main form view
  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Hướng dẫn viên & Tài xế & Xe</Text>

        <Text style={styles.positionButtonLabel}>Xe</Text>
        <PressableOpacity
          style={styles.positionButton}
          onPress={() => setShowPositionPicker(true)}
          hitSlop={4}
        >
          <Text style={styles.positionButtonText}>
            {String(selectedPosition).padStart(2, '0')}
          </Text>
          <FontAwesome name="caret-down" size={20} color={COLORS.vinaupTeal} />
        </PressableOpacity>
      </View>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        keyboardShouldPersistTaps="handled"
      >
        {/* Tour Guide section */}
        <View style={styles.sectionLabelRow}>
          <Text style={styles.sectionLabel}>Hướng dẫn viên</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {tourGuideInputMode === 1 ? 'Tìm kiếm' : 'Tự nhập'}
            </Text>
            <Switch
              value={tourGuideInputMode === 1}
              onValueChange={(val) => {
                setTourGuideInputMode(val ? 1 : 0);
                setTourGuideUserId(null);
                setTourGuideSearchQuery('');
                setTourGuideName('');
                setTourGuidePhone('');
              }}
              trackColor={{
                false: COLORS.vinaupLightGray,
                true: COLORS.vinaupTeal,
              }}
              thumbColor={COLORS.vinaupWhite}
            />
          </View>
        </View>

        {tourGuideInputMode === 0 ? (
          <View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Tên</Text>
              <View style={styles.inputSeparator} />
              <TextInput
                style={styles.inputField}
                value={tourGuideName}
                onChangeText={setTourGuideName}
                placeholder="..."
                placeholderTextColor={COLORS.vinaupMediumGray}
                editable={!isLoading && !tourGuideUserId}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Điện thoại</Text>
              <View style={styles.inputSeparator} />
              <TextInput
                style={styles.inputField}
                value={tourGuidePhone}
                onChangeText={setTourGuidePhone}
                placeholder="..."
                placeholderTextColor={COLORS.vinaupMediumGray}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Tên</Text>
              <View style={styles.inputSeparator} />
              <TextInput
                style={styles.inputField}
                value={tourGuideSearchQuery}
                onChangeText={(text) => {
                  setTourGuideSearchQuery(text);
                  if (tourGuideUserId) setTourGuideUserId(null);
                }}
                placeholder="..."
                placeholderTextColor={COLORS.vinaupMediumGray}
                editable={!isLoading}
              />
              <PressableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  if (tourGuideUserId) {
                    setTourGuideUserId(null);
                    setTourGuideSearchQuery('');
                    resetTourGuideSearch();
                  } else {
                    searchTourGuideUsers();
                  }
                }}
                hitSlop={6}
              >
                {tourGuideUserId ? (
                  <Feather name="x" size={20} color={COLORS.vinaupRed} />
                ) : (
                  <Feather
                    name="search"
                    size={20}
                    color={
                      isSearchingTourGuide
                        ? COLORS.vinaupMediumGray
                        : COLORS.vinaupTeal
                    }
                    style={styles.searchIcon}
                  />
                )}
              </PressableOpacity>
            </View>
            {tourGuideSearchResults &&
              tourGuideSearchResults.length > 0 &&
              !tourGuideUserId && (
                <View style={styles.searchResults}>
                  {(tourGuideSearchResults ?? []).slice(0, 5).map((user) => (
                    <PressableOpacity
                      key={user.id}
                      style={styles.searchResultItem}
                      onPress={() => handleSelectTourGuideUser(user)}
                    >
                      <Avatar imgSrc={user.avatarUrl} size={32} />
                      <View>
                        <Text style={styles.searchResultName}>{user.name}</Text>
                        <Text style={styles.searchResultPhone}>
                          {user.phone ?? '—'}
                        </Text>
                      </View>
                    </PressableOpacity>
                  ))}
                </View>
              )}
            {selectedTourGuideUser && tourGuideUserId && (
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Điện thoại</Text>
                <View style={styles.inputSeparator} />
                <Text style={styles.phoneText}>
                  {selectedTourGuideUser.phone ?? '—'}
                </Text>
              </View>
            )}
          </View>
        )}

        {/* Driver section */}
        <View style={[styles.sectionLabelRow, styles.sectionMarginTop]}>
          <Text style={styles.sectionLabel}>Tài xế</Text>
          <View style={styles.switchRow}>
            <Text style={styles.switchLabel}>
              {driverMode === 1 ? 'Tìm kiếm' : 'Tự nhập'}
            </Text>
            <Switch
              value={driverMode === 1}
              onValueChange={(val) => {
                setDriverMode(val ? 1 : 0);
                setDriverUserId(null);
                setDriverSearchQuery('');
                setDriverName('');
                setDriverPhone('');
              }}
              trackColor={{
                false: COLORS.vinaupLightGray,
                true: COLORS.vinaupTeal,
              }}
              thumbColor={COLORS.vinaupWhite}
            />
          </View>
        </View>

        {driverMode === 0 ? (
          <View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Tên</Text>
              <View style={styles.inputSeparator} />
              <TextInput
                style={styles.inputField}
                value={driverName}
                onChangeText={setDriverName}
                placeholder="..."
                placeholderTextColor={COLORS.vinaupMediumGray}
                editable={!isLoading}
              />
            </View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Điện thoại</Text>
              <View style={styles.inputSeparator} />
              <TextInput
                style={styles.inputField}
                value={driverPhone}
                onChangeText={setDriverPhone}
                placeholder="..."
                placeholderTextColor={COLORS.vinaupMediumGray}
                keyboardType="phone-pad"
                editable={!isLoading}
              />
            </View>
          </View>
        ) : (
          <View>
            <View style={styles.inputRow}>
              <Text style={styles.inputLabel}>Tên</Text>
              <View style={styles.inputSeparator} />
              <TextInput
                style={styles.inputField}
                value={driverSearchQuery}
                onChangeText={(text) => {
                  setDriverSearchQuery(text);
                  if (driverUserId) setDriverUserId(null);
                }}
                placeholder="..."
                placeholderTextColor={COLORS.vinaupMediumGray}
                editable={!isLoading && !driverUserId}
              />
              <PressableOpacity
                onPress={() => {
                  Keyboard.dismiss();
                  if (driverUserId) {
                    setDriverUserId(null);
                    setDriverSearchQuery('');
                    resetDriverSearch();
                  } else {
                    searchDriverUsers();
                  }
                }}
                hitSlop={6}
              >
                {driverUserId ? (
                  <Feather name="x" size={20} color={COLORS.vinaupRed} />
                ) : (
                  <Feather
                    name="search"
                    size={20}
                    color={
                      isSearchingDriver
                        ? COLORS.vinaupMediumGray
                        : COLORS.vinaupTeal
                    }
                    style={styles.searchIcon}
                  />
                )}
              </PressableOpacity>
            </View>
            {driverSearchResults &&
              driverSearchResults.length > 0 &&
              !driverUserId && (
                <View style={styles.searchResults}>
                  {(driverSearchResults ?? []).slice(0, 5).map((user) => (
                    <PressableOpacity
                      key={user.id}
                      style={styles.searchResultItem}
                      onPress={() => handleSelectDriverUser(user)}
                    >
                      <Avatar imgSrc={user.avatarUrl} size={32} />
                      <View>
                        <Text style={styles.searchResultName}>{user.name}</Text>
                        <Text style={styles.searchResultPhone}>
                          {user.phone ?? '—'}
                        </Text>
                      </View>
                    </PressableOpacity>
                  ))}
                </View>
              )}
            {selectedDriverUser && driverUserId && (
              <View style={styles.inputRow}>
                <Text style={styles.inputLabel}>Điện thoại</Text>
                <View style={styles.inputSeparator} />
                <Text style={styles.phoneText}>
                  {selectedDriverUser.phone ?? '—'}
                </Text>
              </View>
            )}
          </View>
        )}

        <View style={[styles.sectionLabelRow, styles.sectionMarginTop]}>
          <Text style={styles.sectionLabel}>Loại Xe</Text>
        </View>
        <View style={styles.inputRow}>
          <Text style={styles.inputLabel}>Tên số xe</Text>
          <View style={styles.inputSeparator} />
          <TextInput
            style={styles.inputField}
            value={carName}
            onChangeText={setCarName}
            placeholder="..."
            placeholderTextColor={COLORS.vinaupMediumGray}
            editable={!isLoading}
          />
        </View>

        {/* Buttons */}
        <View style={styles.buttonGroup}>
          <Button
            style={[styles.cancelButton, isLoading && styles.buttonDisabled]}
            onPress={onCloseRequest}
            disabled={isLoading}
          >
            <Text style={styles.cancelButtonText}>Huỷ</Text>
          </Button>
          <Button
            style={[styles.confirmButton, isLoading && styles.buttonDisabled]}
            onPress={handleConfirm}
            disabled={isLoading}
            isLoading={isLoading}
          >
            <Text style={styles.confirmButtonText}>Xác nhận</Text>
          </Button>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 8,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
    flex: 1,
  },
  positionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginLeft: 4,
  },
  positionButtonLabel: {
    fontSize: 18,
  },
  positionButtonText: {
    fontSize: 18,
    color: COLORS.vinaupTeal,
    fontWeight: '500',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 24,
  },
  sectionLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  sectionMarginTop: {
    marginTop: 12,
  },
  sectionLabel: {
    fontSize: 16,
    color: COLORS.vinaupTeal,
    fontWeight: '500',
  },
  switchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  switchLabel: {
    fontSize: 14,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.vinaupTeal,
    borderRadius: 4,
    overflow: 'hidden',
    minHeight: 50,
    paddingRight: 8,
    marginBottom: 6,
  },
  inputLabel: {
    width: 100,
    paddingLeft: 8,
    fontSize: 18,
    color: '#333',
  },
  inputSeparator: {
    width: 1.5,
    height: '70%',
    backgroundColor: COLORS.vinaupMediumDarkGray,
  },
  inputField: {
    flex: 1,
    fontSize: 18,
    textAlign: 'right',
  },
  searchIcon: {
    marginLeft: 6,
  },
  phoneText: {
    flex: 1,
    fontSize: 18,
    color: COLORS.vinaupDarkGray,
    textAlign: 'right',
  },
  searchResults: {
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    marginBottom: 6,
    maxHeight: 180,
    overflow: 'hidden',
  },
  searchResultItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.vinaupSoftGray,
  },
  searchResultName: {
    fontSize: 14,
    color: COLORS.vinaupBlack,
  },
  searchResultPhone: {
    fontSize: 12,
    color: COLORS.vinaupMediumGray,
  },
  pickerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  pickerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupBlack,
  },
  positionPickerItem: {
    borderRadius: 12,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 2,
  },
  positionPickerItemSelected: {
    backgroundColor: '#F2FBFA',
  },
  positionPickerText: {
    fontSize: 18,
    color: COLORS.vinaupBlack,
  },
  positionPickerTextSelected: {
    color: COLORS.vinaupTeal,
    fontWeight: '500',
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelButton: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.vinaupLightGray,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmButton: {
    flex: 1,
    backgroundColor: COLORS.vinaupTeal,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupTeal,
  },
  confirmButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.vinaupWhite,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
});
