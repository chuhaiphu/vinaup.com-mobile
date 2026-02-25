import Loader from '@/components/primitives/loader';
import { COLORS } from '@/constants/style-constant';
import { useFetchFn } from '@/hooks/use-fetch-fn';
import { useEffect, useState } from 'react';
import {
  FlatList,
  Pressable,
  RefreshControl,
  StyleSheet,
  Text,
  View,
} from 'react-native';
import { Button } from '@/components/primitives/button';
import VinaupAddNew from '@/components/icons/vinaup-add-new.native';
import { useSafeRouter } from '@/hooks/use-safe-router';
import dayjs from 'dayjs';
import { FontAwesome5, FontAwesome6 } from '@expo/vector-icons';
import { TextSwitcher } from '@/components/primitives/text-switcher';
import { ProjectResponse } from '@/interfaces/project-interfaces';
import { getProjectsOfCurrentUserApi } from '@/apis/project-apis';
import { ProjectCard } from '@/components/primitives/project-card';
import { MonthYearPicker } from '@/components/primitives/month-year-picker';

export default function ReceiptPaymentProject() {
  const safeRouter = useSafeRouter();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [textIndex, setTextIndex] = useState(0);

  const {
    data: projects,
    isLoading,
    executeFetchFn: fetchProjects,
    isRefreshing: isRefreshingProjects,
    refreshFetchFn: refreshProjects,
  } = useFetchFn<ProjectResponse[]>();

  useEffect(() => {
    fetchProjects(() =>
      getProjectsOfCurrentUserApi({
        type: textIndex === 0 ? 'SELF' : 'COMPANY',
        month: selectedDate.month() + 1,
        year: selectedDate.year(),
      })
    );
  }, [fetchProjects, selectedDate, textIndex]);

  // Navigate to receipt payment form
  const navigateToForm = async (id?: string) => {
    if (safeRouter.isNavigating) return;
    safeRouter.safePush({
      pathname: '/(protected)/receipt-payment-form',
      params: {
        id: id,
        mode: id ? 'update' : 'create',
        lockDatePicker: 'false',
        allowEditCategory: 'true',
        receiptPaymentType: 'PAYMENT',
      },
    });
  };

  return (
    <View style={styles.container}>
      <View>
        <View style={styles.dateTimePickerContainer}>
          <MonthYearPicker
            leftSection={
              <FontAwesome5
                name="calendar-alt"
                size={18}
                color={COLORS.vinaupTeal}
              />
            }
            value={selectedDate}
            onChange={setSelectedDate}
            displayFormat="MM/YYYY"
            style={{
              dateText: styles.dateText,
            }}
          />
        </View>
        <View style={styles.titleRow}>
          <View style={styles.screenTitleContainer}>
            <Text style={styles.left}>Thu chi </Text>
            <TextSwitcher
              textPair={['Tiền công', 'Dự án']}
              currentIndex={textIndex}
              onToggle={() => setTextIndex(textIndex === 0 ? 1 : 0)}
              rightSection={
                <FontAwesome6
                  name="caret-down"
                  size={20}
                  color={COLORS.vinaupTeal}
                />
              }
            />
          </View>
          <Button
            style={styles.createButtonContainer}
            onPress={() => navigateToForm()}
            isLoading={safeRouter.isNavigating}
          >
            <VinaupAddNew width={28} height={28} />
          </Button>
        </View>
      </View>
      <FlatList
        data={projects}
        contentContainerStyle={{ paddingVertical: 8 }}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <Pressable onPress={() => navigateToForm(item.id)}>
            <ProjectCard project={item} />
          </Pressable>
        )}
        refreshControl={
          <RefreshControl
            refreshing={isRefreshingProjects}
            onRefresh={refreshProjects}
            colors={[COLORS.vinaupTeal]}
          />
        }
      />
      {isLoading && <Loader size={64} />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  left: {
    fontSize: 18,
  },
  right: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  screenTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 12,
    paddingVertical: 16,
    paddingHorizontal: 12,
    backgroundColor: COLORS.vinaupLightGreen,
    borderRadius: 10,
  },
  createButtonContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  dateTimePickerContainer: {
    marginVertical: 12,
    paddingHorizontal: 12,
  },
  dateText: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.vinaupTeal,
  },
  separator: {
    height: 10,
  },
});
