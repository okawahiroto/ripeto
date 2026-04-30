import { ScrollView, Text, View } from 'react-native';
import { useRouter } from 'expo-router';
import { Pressable } from 'react-native';

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 24 }}>
      <Text style={{ fontSize: 16, fontWeight: '700', color: '#1f2937', marginBottom: 8 }}>
        {title}
      </Text>
      {children}
    </View>
  );
}

function Body({ children }: { children: React.ReactNode }) {
  return <Text style={{ fontSize: 14, color: '#374151', lineHeight: 22 }}>{children}</Text>;
}

export { PrivacyScreen as default };

function PrivacyScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
    >
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#1f2937', marginBottom: 4 }}>
        プライバシーポリシー
      </Text>
      <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 28 }}>
        最終更新日：2026年5月1日
      </Text>

      <Section title="1. はじめに">
        <Body>
          Ripeto（以下「本アプリ」）は、川本大人（以下「運営者」）が提供する楽器練習記録アプリです。本プライバシーポリシーは、本アプリが収集する情報の種類、利用目的、および第三者への提供について説明します。
        </Body>
      </Section>

      <Section title="2. 収集する情報">
        <Body>
          本アプリは以下の情報を収集します。{'\n\n'}
          【自動的に生成される情報】{'\n'}• Firebase が付与する匿名の識別子（UID）{'\n'}•
          アプリ利用時のクラッシュログ・エラーログ{'\n\n'}
          【ユーザーが入力する情報】{'\n'}• ゴール・曲目・練習箇所のタイトル{'\n'}•
          練習回数・メモ（フリーテキスト）{'\n\n'}
          【Google / Apple アカウント連携時（任意）】{'\n'}• 各プロバイダーから提供される識別子
          {'\n'}• メールアドレス（プロバイダーの設定により提供される場合）{'\n\n'}
          氏名・住所・電話番号などの個人情報は収集しません。
        </Body>
      </Section>

      <Section title="3. 情報の利用目的">
        <Body>
          収集した情報は以下の目的にのみ使用します。{'\n\n'}• 練習ログの保存・表示{'\n'}•
          複数端末間でのデータ同期{'\n'}• アプリの品質改善・不具合調査{'\n'}•
          広告の配信（無料利用の場合）{'\n'}• 課金状態の管理（プレミアム購入時）
        </Body>
      </Section>

      <Section title="4. 第三者サービスへの情報提供">
        <Body>
          本アプリは以下のサービスを利用しており、各サービスのプライバシーポリシーが適用されます。
          {'\n\n'}
          【Firebase（Google LLC）】{'\n'}
          認証およびデータ保存に使用します。データは Google のサーバー（米国）に保存されます。{'\n'}
          https://firebase.google.com/support/privacy{'\n\n'}
          【Google AdMob（Google LLC）】{'\n'}
          無料ユーザー向けの広告配信に使用します。広告識別子（IDFA/GAID）を収集する場合があります。プレミアム購入後は広告が非表示になり収集されません。
          {'\n'}
          https://policies.google.com/privacy{'\n\n'}
          【RevenueCat, Inc.】{'\n'}
          アプリ内課金の管理に使用します。購入に関する情報が RevenueCat のサーバーに保存されます。
          {'\n'}
          https://www.revenuecat.com/privacy
        </Body>
      </Section>

      <Section title="5. データの保存期間と削除">
        <Body>
          練習ログ等のデータはアカウントが存在する限り保持されます。データの削除をご希望の場合は、下記の連絡先までお問い合わせください。お問い合わせから30日以内に対応します。
        </Body>
      </Section>

      <Section title="6. セキュリティ">
        <Body>
          データへのアクセスは Firebase
          セキュリティルールにより、本人のみに制限されています。ただし、インターネット経由のデータ送受信には固有のリスクが伴うことをご理解ください。
        </Body>
      </Section>

      <Section title="7. 対象年齢">
        <Body>
          本アプリは13歳未満の方を対象としていません。13歳未満の方がデータを提供していることが判明した場合、速やかに削除します。
        </Body>
      </Section>

      <Section title="8. ポリシーの変更">
        <Body>
          本ポリシーは必要に応じて改訂することがあります。重要な変更がある場合はアプリ内でお知らせします。変更後も引き続きご利用いただくことで、改訂されたポリシーに同意したものとみなします。
        </Body>
      </Section>

      <Section title="9. お問い合わせ">
        <Body>
          {
            'プライバシーに関するご質問・データ削除のご要望は下記までご連絡ください。\n\nメール：okawa.hiroto@gmail.com'
          }
        </Body>
      </Section>

      <Pressable
        onPress={() => router.back()}
        style={{ marginTop: 8, padding: 14, alignItems: 'center' }}
      >
        <Text style={{ color: '#3b82f6', fontSize: 15 }}>閉じる</Text>
      </Pressable>
    </ScrollView>
  );
}
