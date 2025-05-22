using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155

namespace BookStore.Models
{
    public class Book
    {
        public int id { get; set; }

        [Column("book_name")]
        public string book_name { get; set; }

        public string author { get; set; }

        public string description { get; set; }

        [Column("page_no")]
        public int page_no { get; set; }

        public decimal rating { get; set; }

        public string language { get; set; }

        public string genre { get; set; }

        public string readed { get; set; }

        [Column("book_cover")]
        public string book_cover { get; set; }

        [Column("created_at")]
        public DateTime created_at { get; set; }
    }
}