const Sequelize = require('sequelize').Sequelize
const DataTypes = require('sequelize').DataTypes

const db_host = process.env.DB_HOST || 'localhost'
const db_port = process.env.DB_PORT || '5432'
const db_user = process.env.DB_USER || ''
const db_password = process.env.DB_PASSWORD || ''
const db_name = process.env.DB_NAME || ''
const db_url = `postgres://${db_user}:${db_password}@${db_host}:${db_port}/${db_name}`

const db = new Sequelize(db_url, {
  dialect: 'postgres',
  logging: false,
})

const tokens = db.define(
  'tokens',
  {
    token: {
      type: DataTypes.UUID,
      primaryKey: true,
      defaultValue: DataTypes.UUIDV4,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    sent_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    expires_at: {
      type: DataTypes.DATE,
      allowNull: false,
    },
  },
  {
    timestamps: false,
  }
)

const insertToken = async (username, sent_at, expires_at) => {
  try {
    const data = await tokens.create({ username, sent_at, expires_at })
    return data.token
  } catch (err) {
    throw new Error(err)
  }
}

const createToken = async (username) => {
  try {
    const sentAt = new Date()
    const expiresAt = new Date(sentAt)
    expiresAt.setMinutes(expiresAt.getMinutes() + 5)
    const token = await insertToken(username, sentAt, expiresAt)
    return token
  } catch (err) {
    throw new Error(err)
  }
}

module.exports = createToken
