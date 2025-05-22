//Võ Ngân Khanh 2124802010728, Đồng Thị Huyền Trang 2124802010155
using Microsoft.EntityFrameworkCore;
using BookStore.Models;

namespace BookStore.Data
{
    public class BookStoreContext : DbContext
    {
        public BookStoreContext(DbContextOptions<BookStoreContext> options)
            : base(options)
        {
        }

        public DbSet<User> Users { get; set; }

        public DbSet<Book> Books { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Book>(entity =>
            {
                entity.ToTable("books");
                entity.HasKey(e => e.id);

                entity.Property(e => e.book_name).IsRequired();
                entity.Property(e => e.author).IsRequired();
                entity.Property(e => e.page_no).IsRequired();
                entity.Property(e => e.rating).HasPrecision(3, 1);
                entity.Property(e => e.genre).HasColumnType("jsonb");
                entity.Property(e => e.created_at).HasDefaultValueSql("CURRENT_TIMESTAMP");
            });
        }
    }
}