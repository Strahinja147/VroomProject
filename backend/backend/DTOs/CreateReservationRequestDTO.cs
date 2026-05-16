namespace backend.DTOs
{
    public class CreateReservationRequestDTO
    {
        public string VehicleId { get; set; } = null!;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}