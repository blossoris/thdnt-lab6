using System;
//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155

namespace BookStore.Models
{
    public class User
    {
        public int Id { get; set; }
        public string Username { get; set; }
        public string Email { get; set; }
        public string Password { get; set; } // Sẽ lưu hash
    }
}
