from datetime import datetime
from sqlalchemy import Column, Integer, String, Float, DateTime, ForeignKey, JSON
from sqlalchemy.orm import relationship

from database import Base


class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    full_name = Column(String, nullable=False)
    email = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    monthly_income = Column(Float, default=0.0)
    created_at = Column(DateTime, default=datetime.utcnow)

    expenses = relationship("Expense", back_populates="owner")
    wallets = relationship("Wallet", back_populates="owner")
    rewards = relationship("RewardAccount", back_populates="owner")


class Expense(Base):
    __tablename__ = "expenses"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    category = Column(String, nullable=False)      # e.g. Food, Housing, Entertainment
    merchant = Column(String, nullable=True)        # e.g. "ستاربكس"
    amount = Column(Float, nullable=False)
    note = Column(String, nullable=True)
    date = Column(DateTime, default=datetime.utcnow)

    owner = relationship("User", back_populates="expenses")


class Wallet(Base):
    __tablename__ = "wallets"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    name = Column(String, nullable=False)

    icon_key = Column(String, default="custom")        # travel / wedding / car / house / emergency_fund / custom
    subtitle = Column(String, nullable=True)            # e.g. "اليابان • 6 أشهر"
    currency = Column(String, default="SAR")
    monthly_target = Column(Float, nullable=True)
    start_date = Column(DateTime, default=datetime.utcnow)
    remaining_months = Column(Integer, nullable=True)
    allocations = Column(JSON, nullable=True)            # list[{category, amount, percentage, rationale}]
    summary = Column(String, nullable=True)

    goal_amount = Column(Float, nullable=False)          # == target_amount
    saved_amount = Column(Float, default=0.0)            # == saved
    target_date = Column(DateTime, nullable=True)

    owner = relationship("User", back_populates="wallets")


class RewardAccount(Base):
    __tablename__ = "reward_accounts"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    points = Column(Integer, default=0)

    owner = relationship("User", back_populates="rewards")


class SecurityLog(Base):
    __tablename__ = "security_logs"

    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    event_type = Column(String, nullable=False)     # e.g. "suspicious_transaction"
    details = Column(String, nullable=False)
    prev_hash = Column(String, nullable=False)
    hash = Column(String, nullable=False)
    timestamp = Column(DateTime, default=datetime.utcnow)