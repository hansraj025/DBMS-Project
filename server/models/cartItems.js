module.exports = (sequelize, DataTypes) => {
    const CartItems = sequelize.define("CartItems", {
        cartItemID: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            autoIncrement: true,
            allowNull: false
        },
        cartID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Carts',
                key: 'cartID'
            },
            onDelete: 'CASCADE'
        },
        bookID: {
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'Books',
                key: 'bookID'
            },
            onDelete: 'CASCADE'
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            validate: {
                min: 1, // Quantity must be greater than 0
                isInt: true
            }
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
            validate: {
                min: 0 // Price must be non-negative
            }
        }
    });

    // Associate Methods
    CartItems.associate = (models) => {
        // Association to Cart
        CartItems.belongsTo(models.Carts, {
            foreignKey: 'cartID',
            onDelete: 'CASCADE'
        });

        // Association to Book
        CartItems.belongsTo(models.Books, {
            foreignKey: 'bookID',
            onDelete: 'CASCADE'
        });
    };

    // Hook to set Price before creation or update
    CartItems.addHook('beforeSave', async (cartItem, options) => {
        const Books = sequelize.models.Books;
 
        // Fetch the book to get its price
        const book = await Books.findByPk(cartItem.bookID);
        if( !book ) {
            throw new Error("Book not found for the given bookID.");
        }

        cartItem.price = cartItem.quantity * book.bookPrice;

    })

    return CartItems;
};
