import { AppProvider, useApp } from './store';
import { BottomNav, CartFab, CartSheet, RedeemDialog, ScratchOverlay, ToastView } from './components';
import { HomeScreen, LoginScreen } from './screens-home';
import { LedgerScreen, MoreScreen, RewardsScreen, ShopScreen } from './screens-tabs';
import { LeaderboardScreen, MediaScreen, NotifsScreen, OrdersScreen, ScanScreen, SupportScreen } from './screens-sub';

function Shell() {
  const app = useApp();
  return (
    <div className="dealer-viewport">
      <div className="phone-shell">
        {app.screen === 'login' ? (
          <LoginScreen />
        ) : (
          <>
            <div ref={app.scrollRef} className="no-scrollbar" style={{ flex: 1, overflowY: 'auto', overflowX: 'hidden', display: 'flex', flexDirection: 'column' }}>
              {app.screen === 'home' && <HomeScreen />}
              {app.screen === 'shop' && <ShopScreen />}
              {app.screen === 'rewards' && <RewardsScreen />}
              {app.screen === 'ledger' && <LedgerScreen />}
              {app.screen === 'leaderboard' && <LeaderboardScreen />}
              {app.screen === 'scan' && <ScanScreen />}
              {app.screen === 'orders' && <OrdersScreen />}
              {app.screen === 'media' && <MediaScreen />}
              {app.screen === 'support' && <SupportScreen />}
              {app.screen === 'notifs' && <NotifsScreen />}
              {app.screen === 'more' && <MoreScreen />}
            </div>
            <CartFab />
            <BottomNav />
          </>
        )}
        <ToastView />
        <ScratchOverlay />
        <CartSheet />
        <RedeemDialog />
      </div>
    </div>
  );
}

export default function DealerApp() {
  const params = new URLSearchParams(window.location.search);
  return (
    <AppProvider startAtLogin={params.has('login')} festival={params.has('festival')}>
      <Shell />
    </AppProvider>
  );
}
