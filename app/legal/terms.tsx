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

export { TermsScreen as default };

function TermsScreen() {
  const router = useRouter();

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: '#f9fafb' }}
      contentContainerStyle={{ padding: 20, paddingBottom: 48 }}
    >
      <Text style={{ fontSize: 22, fontWeight: '800', color: '#1f2937', marginBottom: 4 }}>
        利用規約
      </Text>
      <Text style={{ fontSize: 12, color: '#9ca3af', marginBottom: 28 }}>
        最終更新日：2026年5月1日
      </Text>

      <Section title="1. 本規約への同意">
        <Body>
          本アプリ「Ripeto」（以下「本アプリ」）をインストール・利用することで、本利用規約（以下「本規約」）に同意したものとみなします。同意いただけない場合は、本アプリのご利用をお控えください。
        </Body>
      </Section>

      <Section title="2. サービスの概要">
        <Body>
          本アプリは、楽器の練習を記録・管理するためのモバイルアプリケーションです。ゴール（演奏会・発表会など）に向けた逆算型の練習管理機能を提供します。
        </Body>
      </Section>

      <Section title="3. 利用資格">
        <Body>
          本アプリは13歳以上の方がご利用いただけます。13歳未満の方がご利用になる場合は、保護者の同意が必要です。
        </Body>
      </Section>

      <Section title="4. 禁止事項">
        <Body>
          以下の行為を禁止します。{'\n\n'}• 本アプリのリバースエンジニアリング・改ざん・複製{'\n'}•
          他者のアカウントへの不正アクセス{'\n'}• 虚偽の情報の入力{'\n'}•
          本アプリの正常な動作を妨げる行為{'\n'}• 法令または公序良俗に違反する行為
        </Body>
      </Section>

      <Section title="5. 有償機能（プレミアム）">
        <Body>
          本アプリは「広告を非表示にする」機能を買い切りで提供します。{'\n\n'}•
          購入は各アプリストア（App Store / Google Play）経由で行われます{'\n'}•
          購入後は同一アカウントで複数端末に復元できます（購入を復元する機能を使用）{'\n'}•
          返金については、各ストアのポリシーに従います{'\n'}•
          課金はサブスクリプションではなく買い切りです
        </Body>
      </Section>

      <Section title="6. データの取り扱い">
        <Body>
          収集する情報および利用方法については、プライバシーポリシーをご確認ください。ユーザーが入力した練習ログは、サービス提供の目的にのみ使用します。
        </Body>
      </Section>

      <Section title="7. 免責事項">
        <Body>
          運営者は以下について責任を負いません。{'\n\n'}• ユーザーが入力した練習データの消失{'\n'}•
          通信障害・サービス停止による損害{'\n'}• 本アプリの利用または利用不能に起因する損害{'\n\n'}
          本アプリは「現状有姿（as-is）」で提供され、特定目的への適合性を保証するものではありません。
        </Body>
      </Section>

      <Section title="8. サービスの変更・終了">
        <Body>
          運営者は、事前の告知なく本アプリの機能変更・サービス終了を行う場合があります。サービス終了時のデータ返還・返金義務は負いません。
        </Body>
      </Section>

      <Section title="9. 規約の変更">
        <Body>
          本規約は必要に応じて改訂することがあります。重要な変更がある場合はアプリ内でお知らせします。変更後も引き続きご利用いただくことで、改訂された規約に同意したものとみなします。
        </Body>
      </Section>

      <Section title="10. 準拠法・管轄">
        <Body>
          本規約は日本法に準拠します。本アプリの利用に関して生じた紛争については、運営者の所在地を管轄する裁判所を第一審の専属的合意管轄裁判所とします。
        </Body>
      </Section>

      <Section title="11. お問い合わせ">
        <Body>
          {'本規約に関するご質問は下記までご連絡ください。\n\nメール：okawa.hiroto@gmail.com'}
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
