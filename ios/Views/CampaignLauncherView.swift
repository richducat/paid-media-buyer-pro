import SwiftUI

struct CampaignLauncherView: View {
    @State private var mode = "Ask me first"
    @State private var approved: Set<Int> = []
    private let modes = ["Watch only", "Ask me first", "Autopilot"]

    var body: some View {
        NavigationStack {
            ZStack {
                PMTheme.canvas.ignoresSafeArea()
                ScrollView {
                    VStack(alignment: .leading, spacing: 20) {
                        VStack(alignment: .leading, spacing: 7) {
                            Text("YOUR AI MEDIA BUYER").font(.system(size: 9, weight: .black)).tracking(1.6).foregroundStyle(PMTheme.muted)
                            Text("Changes worth making").font(.system(size: 27, weight: .black, design: .rounded)).tracking(-0.7)
                            Text("Evidence and plain English first. You stay in control of every dollar.").font(.system(size: 13, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(3)
                        }

                        Picker("Buyer mode", selection: $mode) {
                            ForEach(modes, id: \.self) { Text($0).tag($0) }
                        }
                        .pickerStyle(.segmented)

                        RecommendationCard(index: 1, platform: "GOOGLE ADS", title: "Block 14 irrelevant searches", explanation: "Stop paying when people search for jobs, free templates, or DIY help.", proof: "42 clicks · $96 spent · 0 leads", impact: "Est. $184/mo saved", approved: approved.contains(1)) { approved.insert(1) }
                        RecommendationCard(index: 2, platform: "META ADS", title: "Move $18/day to the strongest ad", explanation: "One creative is producing qualified leads more efficiently. Shift a small amount of budget to it.", proof: "Winner CPL $29.14 vs $38.28 average", impact: "Est. 11 more leads/mo", approved: approved.contains(2)) { approved.insert(2) }
                        RecommendationCard(index: 3, platform: "GOOGLE ADS", title: "Keep the brand campaign steady", explanation: "Performance is healthy. Changing it now would add risk without a clear upside.", proof: "ROAS 7.2× · impression share 82%", impact: "No change", approved: approved.contains(3)) { approved.insert(3) }

                        HStack(alignment: .top, spacing: 10) {
                            Image(systemName: "lock.shield.fill").foregroundStyle(PMTheme.success)
                            Text("Demo only: approvals are stored on this device and cannot change an ad account until a secure platform connection exists.").font(.system(size: 10, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(2)
                        }
                        .padding(14)
                        .background(PMTheme.success.opacity(0.08), in: RoundedRectangle(cornerRadius: 15))
                    }
                    .padding(18)
                    .padding(.bottom, 24)
                }
            }
            .navigationTitle("AI Buyer")
            .navigationBarTitleDisplayMode(.inline)
        }
    }
}

private struct RecommendationCard: View {
    let index: Int
    let platform: String
    let title: String
    let explanation: String
    let proof: String
    let impact: String
    let approved: Bool
    let onApprove: () -> Void

    var body: some View {
        VStack(alignment: .leading, spacing: 14) {
            HStack { Text(platform).font(.system(size: 8, weight: .black)).tracking(1.3).foregroundStyle(PMTheme.muted); Spacer(); Text(index == 3 ? "WATCH ONLY" : "LOW RISK").font(.system(size: 8, weight: .black)).foregroundStyle(PMTheme.success).padding(.horizontal, 8).padding(.vertical, 4).background(PMTheme.success.opacity(0.09), in: Capsule()) }
            Text(title).font(.system(size: 18, weight: .black, design: .rounded))
            Text(explanation).font(.system(size: 12, weight: .medium)).foregroundStyle(PMTheme.muted).lineSpacing(3)
            Divider()
            VStack(alignment: .leading, spacing: 5) {
                Text("WHY  ·  \(proof)").font(.system(size: 9, weight: .bold)).foregroundStyle(PMTheme.muted)
                Text("IMPACT  ·  \(impact)").font(.system(size: 9, weight: .black)).foregroundStyle(PMTheme.forest)
            }
            Button(action: onApprove) {
                HStack { Spacer(); Image(systemName: approved ? "checkmark.circle.fill" : "checkmark.shield.fill"); Text(approved ? "Approved in demo" : "Approve recommendation"); Spacer() }
                    .font(.system(size: 12, weight: .black))
                    .padding(.vertical, 12)
                    .foregroundStyle(approved ? PMTheme.success : Color.white)
                    .background(approved ? PMTheme.success.opacity(0.09) : PMTheme.forest, in: RoundedRectangle(cornerRadius: 12))
            }
            .disabled(approved)
        }
        .padding(18)
        .background(PMTheme.surface, in: RoundedRectangle(cornerRadius: 22))
        .overlay(RoundedRectangle(cornerRadius: 22).stroke(PMTheme.line))
    }
}

#Preview { CampaignLauncherView() }
