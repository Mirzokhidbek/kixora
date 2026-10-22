export enum PaymentStatus {
  PAID = "PAID",
  REFUNDED = "REFUNDED",
}

export enum PaymentMethod {
  /** Simulated provider for development/demo: no real money moves */
  TEST = "TEST",
  /** Confirmed by the store admin (cash on delivery, bank transfer, terminal) */
  MANUAL = "MANUAL",
}

export enum PaymentMode {
  TEST = "test",
  MANUAL = "manual",
}
