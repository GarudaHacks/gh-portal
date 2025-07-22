export function formatSpecialization(specialization: string) {
    return (specialization.split(',')).join(", ").toUpperCase()
}