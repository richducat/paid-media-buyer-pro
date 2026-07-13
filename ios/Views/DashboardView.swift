import SwiftUI

enum PMTheme {
    static let canvas = Color(red: 244/255, green: 240/255, blue: 232/255)
    static let surface = Color(red: 251/255, green: 249/255, blue: 244/255)
    static let evergreen = Color(red: 24/255, green: 36/255, blue: 31/255)
    static let forest = Color(red: 34/255, green: 58/255, blue: 46/255)
    static let sage = Color(red: 170/255, green: 190/255, blue: 175/255)
    static let apricot = Color(red: 242/255, green: 166/255, blue: 111/255)
    static let ink = Color(red: 26/255, green: 35/255, blue: 31/255)
    static let muted = Color(red: 101/255, green: 113/255, blue: 106/255)
    static let line = Color(red: 219/255, green: 214/255, blue: 204/255)
    static let success = Color(red: 63/255, green: 119/255, blue: 81/255)
}

struct DashboardView: View {
    private let bars: [CGFloat] = [0.38, 0.52, 0.46, 0.64, 0.58, 0.72, 0.68, 0.84, 0.74, 0.92, 0.86, 1]

    var body: some View {
        NavigationStack {
            ZStack {
                PMTheme.canvas.ignoresSafeArea()
                ScrollView {
                    VStack(alignment: .leading, spacing: 22) {
                        demoNotice
                        summary
                        metrics
                        chart
                        agentBrief
                    }
                    .padding(.horizontal, 18)
                    .padding(.bottom, 28)
                }
            }
            .toolbar {
                ToolbarItem(placement: .principal) {
                    VStack(spacing: 1) {
                        Text("Paid Media Pro").font(.system(size: 17, weight: .black, design: .rounded))
                        Text("OVERVIEW").font(.system(size: 8, weight: .bold)).tracking(1.5).foregroundStyle(PMTheme.muted)
                    }
                }
                ToolbarItem(placement: .topBarTrailing) {
                    Button(action: {}) { Image(systemName: "person.crop.circle.fill").font(.title2).foregroundStyle(PMTheme.forest) }
                }
            }
        }
    }

    private var demoNotice: some View {
        HStack(alignment: .top, spacing: 12) {
            Image(systemName: "sparkles").foregroundStyle(Color.brown).padding(9).background(Color.orange.opacity(0.14), in: RoundedRectangle(cornerRadius: 11))
            VStack(alignment: .leading, spacing: 3) {
                Text("Sample workspace").font(.system(size: 13, weight: .black))
                Text("Explore safely. Nothing here can spend money or change an ad account.").font(.system(size: 11, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(2)
            }
        }
        .padding(14)
        .background(Color(red: 1, green: 0.97, blue: 0.91), in: RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(Color.orange.opacity(0.2)))
    }

    private var summary: some View {
        VStack(alignment: .leading, spacing: 8) {
            Text("LAST 30 DAYS").font(.system(size: 9, weight: .black)).tracking(1.6).foregroundStyle(PMTheme.muted)
            Text("More qualified leads,\nless wasted spend.").font(.system(size: 28, weight: .black, design: .rounded)).tracking(-0.8).foregroundStyle(PMTheme.ink)
            Text("The AI buyer found two low-risk improvements ready for review.").font(.system(size: 13, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(3)
        }
    }

    private var metrics: some View {
        LazyVGrid(columns: [GridItem(.flexible()), GridItem(.flexible())], spacing: 12) {
            MetricTile(label: "Ad spend", value: "$12,480", change: "+8.2%", explanation: "Paid this month")
            MetricTile(label: "Qualified leads", value: "326", change: "+18.4%", explanation: "Valuable actions")
            MetricTile(label: "Cost per lead", value: "$38.28", change: "−8.7%", explanation: "Cost for one lead")
            MetricTile(label: "ROAS", value: "4.18×", change: "+0.62×", explanation: "$4.18 back per $1")
        }
    }

    private var chart: some View {
        VStack(alignment: .leading, spacing: 18) {
            HStack {
                VStack(alignment: .leading, spacing: 2) {
                    Text("Spend and leads").font(.system(size: 16, weight: .black))
                    Text("Google + Meta · sample").font(.system(size: 10, weight: .bold)).foregroundStyle(PMTheme.muted)
                }
                Spacer()
                Text("+18%").font(.system(size: 11, weight: .black)).foregroundStyle(PMTheme.success).padding(.horizontal, 9).padding(.vertical, 5).background(PMTheme.success.opacity(0.1), in: Capsule())
            }
            HStack(alignment: .bottom, spacing: 6) {
                ForEach(Array(bars.enumerated()), id: \.offset) { index, bar in
                    RoundedRectangle(cornerRadius: 4)
                        .fill(index == bars.count - 1 ? PMTheme.apricot : PMTheme.sage.opacity(0.75))
                        .frame(maxWidth: .infinity)
                        .frame(height: 118 * bar)
                }
            }
            .frame(height: 120, alignment: .bottom)
        }
        .padding(18)
        .background(PMTheme.surface, in: RoundedRectangle(cornerRadius: 22))
        .overlay(RoundedRectangle(cornerRadius: 22).stroke(PMTheme.line))
    }

    private var agentBrief: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack {
                Image(systemName: "sparkles").foregroundStyle(PMTheme.apricot)
                Text("Today’s buyer brief").font(.system(size: 16, weight: .black))
                Spacer()
                Text("2 TO REVIEW").font(.system(size: 8, weight: .black)).tracking(1).foregroundStyle(PMTheme.sage)
            }
            Text("Efficiency improved without increasing risk. Search-term cleanup can save about $184 per month, and one Meta creative has earned a careful budget increase.").font(.system(size: 13, weight: .medium)).foregroundStyle(Color.white.opacity(0.72)).lineSpacing(4)
            Divider().overlay(Color.white.opacity(0.1))
            HStack { Text("Open AI Buyer").font(.system(size: 13, weight: .black)).foregroundStyle(PMTheme.apricot); Spacer(); Image(systemName: "arrow.right").foregroundStyle(PMTheme.apricot) }
        }
        .padding(20)
        .foregroundStyle(.white)
        .background(PMTheme.evergreen, in: RoundedRectangle(cornerRadius: 24))
    }
}

private struct MetricTile: View {
    let label: String
    let value: String
    let change: String
    let explanation: String

    var body: some View {
        VStack(alignment: .leading, spacing: 7) {
            HStack { Text(label).font(.system(size: 10, weight: .bold)).foregroundStyle(PMTheme.muted); Spacer(); Text(change).font(.system(size: 9, weight: .black)).foregroundStyle(PMTheme.success) }
            Text(value).font(.system(size: 24, weight: .black, design: .rounded)).tracking(-0.5)
            Text(explanation).font(.system(size: 9, weight: .medium)).foregroundStyle(PMTheme.muted)
        }
        .frame(maxWidth: .infinity, alignment: .leading)
        .padding(15)
        .background(PMTheme.surface, in: RoundedRectangle(cornerRadius: 18))
        .overlay(RoundedRectangle(cornerRadius: 18).stroke(PMTheme.line))
    }
}

#Preview { DashboardView() }
