import SwiftUI

struct ContentView: View {
    @State private var selectedTab = 0

    var body: some View {
        TabView(selection: $selectedTab) {
            DashboardView()
                .tabItem { Label("Overview", systemImage: "square.grid.2x2.fill") }
                .tag(0)

            CampaignLauncherView()
                .tabItem { Label("AI Buyer", systemImage: "sparkles") }
                .tag(1)

            PixelStatusView()
                .tabItem { Label("Connect", systemImage: "link.circle.fill") }
                .tag(2)
        }
        .tint(PMTheme.apricot)
        .onAppear {
            let appearance = UITabBarAppearance()
            appearance.configureWithOpaqueBackground()
            appearance.backgroundColor = UIColor(PMTheme.evergreen)
            appearance.shadowColor = .clear
            appearance.stackedLayoutAppearance.selected.iconColor = UIColor(PMTheme.apricot)
            appearance.stackedLayoutAppearance.selected.titleTextAttributes = [.foregroundColor: UIColor(PMTheme.apricot)]
            appearance.stackedLayoutAppearance.normal.iconColor = UIColor(PMTheme.sage)
            appearance.stackedLayoutAppearance.normal.titleTextAttributes = [.foregroundColor: UIColor(PMTheme.sage)]
            UITabBar.appearance().standardAppearance = appearance
            UITabBar.appearance().scrollEdgeAppearance = appearance
        }
    }
}

#Preview { ContentView() }
