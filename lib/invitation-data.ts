export type InvitationData = {
  honoreeName: string
  eventTitle: string
  dateLabel: string
  dateISO: string
  timeLabel: string
  venueName: string
  venueAddress: string
  mapUrl: string
  whatsappNumber: string
  whatsappMessage: string
  dressCode: string
  audioUrl: string
  heroImage: string
}

export const invitationData: InvitationData = {
  honoreeName: 'Yadi',
  eventTitle: 'Una noche para celebrar',
  dateLabel: 'Domingo, 6 de Diciembre de 2026',
  dateISO: '2026-12-06T20:00:00',
  timeLabel: '7:00 PM',
  venueName: 'Mi Casa Tu Casa',
  venueAddress: 'Nopalera 8, El Calvario, 62764 Emiliano Zapata, Mor.',
  mapUrl: 'https://maps.app.goo.gl/kfiBhRxutVCSoiPc7',
  whatsappNumber: '5217774387005', //+52 1 777 438 7005
  whatsappMessage: 'Hola, confirmo mi asistencia a la celebración de Yadi.',
  dressCode: 'Elegante con movimiento',
  audioUrl: '/music.mp3',
  heroImage: '/images/yadi-dance-silhouette.png',
}
