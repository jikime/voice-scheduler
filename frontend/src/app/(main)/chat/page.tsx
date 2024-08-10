import VoiceChat from '@/components/chat/main';
import { ContentLayout } from '@/components/panel/content-layout';

export default async function MailPage() {
  return (
    <ContentLayout title="Voice Chat">
      <VoiceChat />
    </ContentLayout>
  );
}
