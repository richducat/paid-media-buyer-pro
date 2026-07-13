import SwiftUI

struct PixelStatusView: View {
    var body: some View {
        NavigationStack {
            ZStack {
                PMTheme.canvas.ignoresSafeArea()
                ScrollView {
                    VStack(alignment: .leading, spacing: 22) {
                        VStack(alignment: .leading, spacing: 7) {
                            Text("ONE-CLICK SETUP").font(.system(size: 9, weight: .black)).tracking(1.6).foregroundStyle(PMTheme.muted)
                            Text("Connect once.\nWe handle the busywork.").font(.system(size: 27, weight: .black, design: .rounded)).tracking(-0.7)
                            Text("Sign in with accounts you already own. Paid Media Pro begins read-only and shows its plan before it can act.").font(.system(size: 13, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(3)
                        }

                        ConnectionCard(letter: "G", title: "Google Ads", detail: "Search, Performance Max, Shopping, YouTube, and conversion actions.")
                        ConnectionCard(letter: "M", title: "Meta Ads", detail: "Facebook and Instagram campaigns, creatives, audiences, and Pixel data.")

                        VStack(alignment: .leading, spacing: 16) {
                            SetupStep(number: "1", title: "Connect securely", detail: "Google or Meta opens its own sign-in screen. We never see your password.")
                            SetupStep(number: "2", title: "Review the account", detail: "The agent checks structure, tracking, spend, and results before recommending anything.")
                            SetupStep(number: "3", title: "Choose control", detail: "Stay read-only, approve each change, or allow bounded autopilot.")
                        }
                        .padding(18)
                        .background(PMTheme.surface, in: RoundedRectangle(cornerRadius: 22))
                        .overlay(RoundedRectangle(cornerRadius: 22).stroke(PMTheme.line))

                        Link(destination: URL(string: "https://paid-media-buyer-pro.vercel.app/dashboard")!) {
                            HStack { Image(systemName: "safari.fill"); Text("Open secure web setup"); Spacer(); Image(systemName: "arrow.up.right") }
                                .font(.system(size: 13, weight: .black))
                                .foregroundStyle(Color.white)
                                .padding(16)
                                .background(PMTheme.forest, in: RoundedRectangle(cornerRadius: 15))
                        }

                        Text("The current production URL is unavailable. The button is retained for the next deployment and does not imply a live connection.")
                            .font(.system(size: 9, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(2)
                    }
                    .padding(18)
                    .padding(.bottom, 24)
                }
            }
            .navigationTitle("Connections")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

private struct ConnectionCard: View {
    let letter: String
    let title: String
    let detail: String

    var body: some View {
        VStack(alignment: .leading, spacing: 15) {
            HStack {
                Text(letter).font(.system(size: 17, weight: .black)).frame(width: 42, height: 42).background(PMTheme.canvas, in: RoundedRectangle(cornerRadius: 13))
                Spacer()
                Text("NOT CONNECTED").font(.system(size: 8, weight: .black)).tracking(1).foregroundStyle(Color.brown).padding(.horizontal, 8).padding(.vertical, 5).background(Color.orange.opacity(0.1), in: Capsule())
            }
            Text(title).font(.system(size: 18, weight: .black, design: .rounded))
            Text(detail).font(.system(size: 11, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(3)
            HStack { Image(systemName: "lock.fill"); Text("Web OAuth setup required"); Spacer() }
                .font(.system(size: 11, weight: .black)).foregroundStyle(PMTheme.muted).padding(12).background(PMTheme.canvas, in: RoundedRectangle(cornerRadius: 11))
        }
        .padding(18)
        .background(PMTheme.surface, in: RoundedRectangle(cornerRadius: 22))
        .overlay(RoundedRectangle(cornerRadius: 22).stroke(PMTheme.line))
    }
}

private struct SetupStep: View {
    let number: String
    let title: String
    let detail: String

    var body: some View {
        HStack(alignment: .top, spacing: 12) {
            Text(number).font(.system(size: 11, weight: .black)).frame(width: 27, height: 27).background(PMTheme.apricot.opacity(0.22), in: Circle())
            VStack(alignment: .leading, spacing: 3) { Text(title).font(.system(size: 12, weight: .black)); Text(detail).font(.system(size: 10, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(2) }
        }
    }
}

#Preview { PixelStatusView() }
