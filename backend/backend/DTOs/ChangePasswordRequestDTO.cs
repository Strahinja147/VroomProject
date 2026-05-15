namespace backend.DTOs
{
    public class ChangePasswordRequestDTO
    {
        public string OldPassword { get; set; } = null!;
        public string NewPassword { get; set; } = null!;
    }
}
